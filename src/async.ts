
import type {Nilable} from './types';

import {__UNDEFINED, F_NOOP, is_finite} from './belt.js';

/**
 * Promise-based version of `setTimeout()`
 * @param xt_wait - number of milliseconds to wait
 * @returns Promise that resolves once the timeout has occurred
 */
export const timeout = (xt_wait: number): Promise<void> => new Promise(fk_resolve => setTimeout(() => fk_resolve(__UNDEFINED), xt_wait));

/**
 * Attempts to execute a given async function, timing out after the given number of milliseconds.
 * Optionally accepts `Infinity` for the wait argument.
 * @param xt_wait - number of milliseconds to wait
 * @param f_attempt - the async function to execute
 * @returns Promise that resolves once the timeout has occurred
 */
export const timeout_exec = <
	w_return extends any=any,
>(xt_wait: number, f_attempt?: () => Promise<w_return>): Promise<
	[w_return, 0] | [undefined, 1]
> => new Promise((fk_resolve, fe_reject) => {
	// whether the timeout occurred
	let b_timed_out = false;

	// attempt callback
	f_attempt?.()
		.then((w_return: w_return) => {
			// already timed out
			if(b_timed_out) return;

			// cancel pending timer
			clearTimeout(i_pending);

			// resolve promise
			fk_resolve([w_return, 0]);
		})
		.catch((e_attempt: unknown) => {
			fe_reject(e_attempt);  // eslint-disable-line @typescript-eslint/prefer-promise-reject-errors
		});

	// start waiting
	const i_pending: number = is_finite(xt_wait)
		? (setTimeout as Window['setTimeout'])(() => {
			// mark as timed out
			b_timed_out = true;

			// resolve promise
			fk_resolve([__UNDEFINED, 1]);
		}, xt_wait)
		: 0;
});

/**
 * A Promise that never fulfills nor rejects
 */
export const forever = <w_type=void>(w_type?: w_type): Promise<w_type> => new Promise(F_NOOP);


/**
 * Promse-based version of `queueMicrotask()`
 */
export const microtask = (): Promise<void> => new Promise((fk_resolve) => {
	queueMicrotask(() => {
		fk_resolve(__UNDEFINED);
	});
});


/**
 * Convenient way to connect async/await flow with callback-based methods.
 * 
 * Creates a new Promise and combines the resolve and reject functions into a single callback.
 * 
 * Example:
 * ```ts
 * // create a new Promise and get its resolver callback
 * const [dp_complete, fke_resolve] = defer<boolean>();
 * 
 * // call some method that uses callbacks
 * do_something_with_callback((value: string, err?: Error) => {
 * 	if('done' === value) fke_resolve(true, err);
 * });
 * 
 * // if there was an error, this will throw via Promise rejection
 * // otherwise, this will return the boolean passed to the resolver
 * return await dp_complete;
 * ```
 * 
 * @returns a Promise that resolves with the value passed to the resolver's return value,
 * or throws with the value passed to the resolver's rejection argument
 */
export const defer = <w_return extends any=any>(): [
	Promise<w_return>,
	{
		(w_return: w_return): void;
		(w_return: Nilable<void>, e_reject: Error): void;
	},
] => {
	let fk_resolve: w_return extends void | undefined
		? (w_return?: w_return, e_reject?: Error) => void
		: (w_return: w_return, e_reject?: Error) => void;

	let fe_reject: (e_reject: Error) => void;

	return [
		new Promise<w_return>((fk, fe) => {
			fk_resolve = fk as typeof fk_resolve;
			fe_reject = fe;
		}),
		(w_return_p?: Nilable<w_return> | void, e_reject?: Error) => {
			if(e_reject) {
				fe_reject(e_reject);
			}
			else {
				// ts 5.4 is so broken
				fk_resolve(w_return_p as void | undefined);
			}
		},
	];
};


/**
 * Alias the Promise.resolve call
 * @param w_value 
 * @returns 
 */
export const promise_resolve = <w_value>(w_value: w_value): Promise<Awaited<w_value>> => Promise.resolve(w_value);
