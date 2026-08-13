/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
import type {O} from 'ts-toolbelt';

import type {Promisable} from './types';

import {defer} from './async.js';
import {__UNDEFINED, assign, create, is_finite} from './belt.js';

type Timeout = NodeJS.Timeout | number | undefined;

type DebouncerWaiter = ReturnType<typeof defer<number>>[1];

export interface Debouncer {
	/**
	 * Starts queueing the execution. Subsequent calls aggregate
	 */
	hit(): void;

	/**
	 * Returns a Promise that waits for the next clear event. Returns number of hits
	 */
	clears(): Promise<number>;

	/**
	 * Cancels the next execution, resets pending state, and settles clear listeners
	 */
	cancel(): Promise<void>;
}

type DebouncerPrivate = {
	// execution callback
	f: () => Promisable<any>;

	// termination function
	t: (this: DebouncerInternal, xc_cancel?: 0 | 1, xc_idle?: 0 | 1) => Promise<void>;

	// span of time allowed to pass after initial hit
	s: number;

	// span timeout
	S: Timeout;

	// delay of time after last hit
	d: number;

	// delay timeout
	D: Timeout;

	// idle time allowed to pass after last execution
	i: number;

	// idle timeout
	I: Timeout;

	// current number of hits
	c: number;

	// count timeout
	C: Timeout;

	// busy flag
	b: 0 | 1;

	// execution was requested while busy
	p: 0 | 1;

	// maximum number of hits before executing
	n: number;

	// clears hooks
	r: DebouncerWaiter[];
};

type DebouncerInternal = Debouncer & DebouncerPrivate;

// alias clearTimeout
const clear = clearTimeout;

// clear all timers and reset their references
const clear_timers = (k_this: DebouncerInternal): void => {
	clear(k_this.S);
	clear(k_this.D);
	clear(k_this.I);
	clear(k_this.C);

	// reset timer references
	k_this.S = k_this.D = k_this.I = k_this.C = __UNDEFINED;
};

const G_PROTOTYPE: Debouncer & Pick<DebouncerPrivate, 't'> = {
	// private termination function
	async t(this: DebouncerInternal, xc_cancel=0, xc_idle=0) {
		// ref this
		let k_this = this;

		// ref number of hits
		let c_hits = k_this.c;

		// cancel pending work and settle its listeners
		if(xc_cancel) {
			k_this.c = 0;
			k_this.p = 0;

			// clear all timers and reset their references
			clear_timers(k_this);

			// settle clear listeners
			k_this.r.splice(0).map(f_cleared => f_cleared(c_hits));
			return;
		}

		// a hit can race with an idle timer that is already queued
		if(xc_idle && c_hits) xc_idle = 0;

		// serialize callback executions
		if(k_this.b) {
			// not idle; mark pending execution
			if(!xc_idle) {
				k_this.p = 1;

				// clear all timers and reset their references
				clear_timers(k_this);
			}

			// exit early
			return;
		}

		// clear all timers and reset their references
		clear_timers(k_this);

		// no work to do
		if(!xc_idle && !c_hits) return;

		// claim the current batch
		k_this.c = 0;
		k_this.p = 0;

		// mark as busy
		k_this.b = 1;

		// clear listeners
		const a_cleared = xc_idle? []: k_this.r.splice(0);
		let b_succeeded = false;

		// try to execute
		try {
			// execute callback
			await k_this.f();

			// mark success
			b_succeeded = true;

			// resolve all cleared listeners
			a_cleared.map(f_cleared => f_cleared(c_hits));
		}
		// handle error
		catch(e_exec) {
			a_cleared.map(f_cleared => f_cleared(__UNDEFINED, e_exec as Error));
		}
		// always run cleanup
		finally {
			k_this.b = 0;

			// a trigger elapsed while the prior callback was still running
			if(k_this.p) {
				k_this.p = 0;
				k_this.C = setTimeout(() => {
					void k_this.t();
				}, 0);
			}
			// idle execution happens at most once after a successful non-idle execution
			else if(!k_this.c && b_succeeded && !xc_idle && is_finite(k_this.i)) {
				k_this.I = setTimeout(() => {
					void k_this.t(0, 1);
				}, k_this.i);
			}
		}
	},

	/**
	 * "Hit" the debouncer, queueing execution if not already queued
	 * @param this 
	 */
	hit(this: DebouncerInternal): void {
		// ref this
		let k_this = this;

		// ,t=k.tttt
		// k.tk.tk.t

		// k.nk.tk.sk.tk.sk.dk.tk.d
		// ,[n,t,s,d]=ntstsdtd

		// incremenet call count
		let c_calls = k_this.c++;

		// new work supersedes an idle execution
		clear(k_this.I);
		k_this.I = __UNDEFINED;

		// wrap termination function for passing to timeout
		const f_t = () => {
			void k_this.t();
		};

		// reached call count; execute
		if(c_calls+1 >= k_this.n) {
			// cancel previous timeout
			clear(k_this.C);

			// set a timeout to execute after current tick
			k_this.C = setTimeout(f_t, 0);
		}
		// not yet reached
		else {
			// initial hit; set a timeout to execute once the max time span passes
			if(!c_calls) if(is_finite(k_this.s)) k_this.S = setTimeout(f_t, k_this.s);

			// set a timeout to execute once the delay passes
			if(is_finite(k_this.d)) {
				// cancel previous timeout
				clear(k_this.D);

				// set new timeout
				k_this.D = setTimeout(f_t, k_this.d);
			}
		}
	},

	/**
	 * Waits until the next execution
	 * @param this 
	 * @returns 
	 */
	clears(this: DebouncerInternal): Promise<number> {
		// no hits, resolve immediately
		if(!this.c) return Promise.resolve(0);

		// creates a deferred Promise
		const [dp_cleared, f_cleared] = defer<number>();

		// adds resolver to list
		this.r.push(f_cleared);

		// returns Promise
		return dp_cleared;
	},

	/**
	 * Cancels the next execution
	 * @param this 
	 */
	cancel(this: DebouncerInternal) {
		return this.t(1);
	},
};

/**
 * Allows for many timing-based use cases where some action should be debounced.
 * @param f_exec - execution callback
 * @param xt_span - executes once this amount of time has passed after the initial hit
 * @param xt_delay - executes once this amount of time has passed after the last hit
 * @param xt_idle - executes once after this amount of idle time has passed since the last execution
 * @param n_calls - executes once this number of hits has occurred after initial hit
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Debouncer = (
	f_exec: () => Promisable<any>,
	xt_span: number,
	xt_delay=Infinity,
	xt_idle=Infinity,
	n_calls=Infinity
): Debouncer => assign(
	create(G_PROTOTYPE) as Debouncer, {
		// execution callback
		f: f_exec,

		// args
		s: xt_span,
		d: xt_delay,
		i: xt_idle,
		n: n_calls,

		// fields
		b: 0,
		p: 0,
		c: 0,
		r: [],
	} satisfies Omit<DebouncerPrivate, O.SelectKeys<DebouncerPrivate, undefined> | 't'>
);
