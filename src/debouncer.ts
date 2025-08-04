/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
import type {O} from 'ts-toolbelt';

import type {Promisable} from './types';

import {defer} from './async.js';
import {__UNDEFINED, assign, create, is_finite} from './belt.js';

type Timeout = NodeJS.Timeout | number | undefined;

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
	 * Cancels the next execution and resets eveything
	 */
	cancel(): Promise<void>;
}

type DebouncerPrivate = {
	// execution callback
	f: () => Promisable<any>;

	// termination function
	t: (this: DebouncerInternal, xc_execute?: 0 | 1) => Promise<void>;

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

	// maximum number of hits before executing
	n: number;

	// clears hooks
	r: ((c_hits: number) => Promisable<any>)[];
};

type DebouncerInternal = Debouncer & DebouncerPrivate;

// alias clearTimeout
const clear = clearTimeout;

const G_PROTOTYPE: Debouncer & Pick<DebouncerPrivate, 't'> = {
	// private termination function
	async t(this: DebouncerInternal, xc_cancel=0) {
		// ref this
		let k_this = this;

		// ref number of hits
		let c_hits = k_this.c;

		// reset counter
		k_this.c = 0;

		// clear timeouts
		clear(k_this.S);
		clear(k_this.D);
		clear(k_this.I);
		clear(k_this.C);

		// reset timeouts
		k_this.S = k_this.D = k_this.I = k_this.C = __UNDEFINED;

		// execution wasn't cancelled
		if(!xc_cancel) {
			// mark as busy
			k_this.b = 1;

			// get and clear queued 'clears' hooks
			const a_cleared = k_this.r.splice(0);

			// execute
			await k_this.f();

			// mark as not busy
			k_this.b = 0;

			// call hooks with number of hits
			a_cleared.map(f => f(c_hits));
		}

		// set a timeout to execute once the idle passes
		if(is_finite(k_this.i)) k_this.I = setTimeout(() => k_this.t(), k_this.i);
	},

	/**
	 * "Hit" the debouncer, queueing execution if not already queued
	 * @param this 
	 */
	async hit(this: DebouncerInternal): Promise<void> {
		// ref this
		let k_this = this;

		// ,t=k.tttt
		// k.tk.tk.t

		// k.nk.tk.sk.tk.sk.dk.tk.d
		// ,[n,t,s,d]=ntstsdtd

		// incremenet call count
		let c_calls = k_this.c++;

		// wrap termination function for passing to timeout
		const f_t = () => k_this.t();

		// reached call count; execute
		if(c_calls+1 >= k_this.n) {
			// busy
			if(k_this.b) await k_this.clears();

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
 * @param xt_idle - executes once this amount of time has passed after the last execution
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
		c: 0,
		r: [],
	} satisfies Omit<DebouncerPrivate, O.SelectKeys<DebouncerPrivate, undefined> | 't'>
);
