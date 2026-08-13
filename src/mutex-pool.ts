/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/naming-convention */
import type {Promisable} from './types';

import {promise_resolve} from './async.js';
import {__UNDEFINED, assign, create, die} from './belt.js';

type PromisableCallback<w_return=void> = () => Promisable<w_return>;


export interface MutexPool {
	/**
	 * Acquire a mutex. If one is free in the pool it will return immediately,
	 *   otherwise it will be queued to receive mutex when one becomes avail.
	 * @param {any} w_data - data to associate with this mutex
	 * @return {Promise<Release>} - resolves with function to call when user
	 *   is ready to release this mutex
	 */
	acquire(this: MutexPool): Promise<PromisableCallback>;

	/**
	 * Wait for a mutex, use it, and then return it to the pool
	 * @param f_use
	 */
	use<w_return>(this: MutexPool, f_use: PromisableCallback<w_return>): Promise<w_return>;

	/**
	 * Wait until all tasks have finished
	 */
	stasis(): Promise<void>;
}

type MutexPoolPrivate = {
	// capacity of pool
	c: number;

	// available number of mutexes
	a: number;

	// queued tasks
	q: PromisableCallback[];

	// list of listeners awaiting to be notified once all tasks have settled
	l: PromisableCallback[];
};

type MutexPoolInternal = MutexPoolPrivate & MutexPool;

const S_ERROR_REPEATED_RELEASE = 'Mutex was already released';

const G_PROTOTYPE: MutexPool = {
	acquire(this: MutexPoolInternal) {
		// ref this
		const k_this = this;

		// destructure fields
		const [a_queued, a_listeners] = [k_this.q, k_this.l];

		// prevent repeated releases
		let c_releases = 0;

		// create the release callback
		const f_release: PromisableCallback = () => {
			// ensure release is not called more than once
			if(c_releases++) die(S_ERROR_REPEATED_RELEASE);

			// queue a microtask to happen on next tick
			queueMicrotask(() => {
				// a queued task is waiting
				if(a_queued.length) {
					// remove from queue and reuse this mutex for next task
					void a_queued.shift()!();
				}
				// no queued tasks; return mutex to pool; back to stasis
				else if(++k_this.a === k_this.c) {
					// notify listeners
					let f_notify;

					// eslint-disable-next-line no-cond-assign
					while(f_notify = a_listeners.shift()) {
						void f_notify();
					}
				}
			});
		};

		// a mutex is available
		if(k_this.a) {
			// claim it
			k_this.a--;

			// return release callback
			return promise_resolve(f_release);
		}
		// all mutexes are busy
		else {
			// go async
			return new Promise((fk_acquire) => {
				// queue a task
				a_queued.push(() => {
					// resolve the acquiree with release callback
					fk_acquire(f_release);
				});
			});
		}
	},

	async use(this: MutexPoolInternal, f_use) {
		// acquire a mutex
		const f_release = await this.acquire();

		// attempt to use it
		try {
			return await f_use();
		}
		// no matter what...
		finally {
			// return it to the pool
			void f_release();
		}
	},

	stasis(this: MutexPoolInternal): Promise<void> {
		// already at stasis
		return this.a === this.c
			// resolve immediately
			? promise_resolve(__UNDEFINED)
			// go async; add listener
			: new Promise(fk_resolve => this.l.push(fk_resolve));
	},
};

/**
 * This data structure allows checking out virtual 'mutexes' for multiple concurrent
 *   uses of a single/shared/limited resource such as network I/O.
 */
export const MutexPool = (n_mutexes=1): MutexPool => assign(
	// create internal fields
	create(G_PROTOTYPE) as MutexPool, {
		c: n_mutexes,
		a: n_mutexes,
		q: [],
		l: [],
	} satisfies MutexPoolPrivate
);
