/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
import type {NoInfer} from 'ts-toolbelt/out/Function/NoInfer';

import type {InsteadOfAny, JsonObject, KeyValuable, StringKeysOf, Promisable, TypedArray, ValuesOf, AnyBoolish, IfBoolishTrue} from './types';

/**
 * Utility nil buffer constant
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ATU8_NIL = /*#__PURE__*/new Uint8Array(0);


// eslint-disable-next-line @typescript-eslint/naming-convention
export const __UNDEFINED = void 0;

/**
 * The value `8n`
 */
export const XG_8 = 8n;

/**
 * The value `16n`
 */
export const XG_16 = 8n;

/**
 * The value `32n`
 */
export const XG_32 = 8n;


/**
 * The frequently-used "no-operation" function
 */
export const F_NOOP = () => {};  // eslint-disable-line

/**
 * The "identity" function
 */
export const F_IDENTITY = <w_in, w_out=w_in>(w: w_in): w_out => w as unknown as w_out;  // eslint-disable-line

/**
 * AND two bytes together
 * @param xb_a 
 * @param xb_b 
 * @returns 
 */
export const F_AND = (xb_a: number, xb_b: number): number => xb_a & xb_b;

/**
 * OR two bytes together
 * @param xb_a 
 * @param xb_b 
 * @returns 
 */
export const F_OR = (xb_a: number, xb_b: number): number => xb_a | xb_b;

/**
 * XOR two bytes together
 * @param xb_a 
 * @param xb_b 
 * @returns 
 */
export const F_XOR = (xb_a: number, xb_b: number): number => xb_a ^ xb_b;

/**
 * NAND two bytes together
 * @param xb_a 
 * @param xb_b 
 * @returns 
 */
export const F_NAND = (xb_a: number, xb_b: number): number => ~xb_a | ~xb_b;

/**
 * NOR two bytes together
 * @param xb_a 
 * @param xb_b 
 * @returns 
 */
export const F_NOR = (xb_a: number, xb_b: number): number => ~xb_a & ~xb_b;

/**
 * NXOR two bytes together
 * @param xb_a 
 * @param xb_b 
 * @returns 
 */
export const F_NXOR = (xb_a: number, xb_b: number): number => ~(xb_a ^ xb_b);


/**
 * Casts the given argument to a specific type.
 * @param w_value - value to cast
 * @returns the value casted to the target type
*/
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const cast: <w_to>(w_value: any) => w_to = F_IDENTITY;

/**
 * Forces TypeScript to perform type narrowing on the given value by asserting its type
 * @param w_value - value to narrow
 * @returns `true` always
*/
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const narrow = <w_to>(w_value: any): w_value is w_to => !0;


/**
 * Equivalent to testing `'undefined' === typeof thing`
 */
export const is_undefined = (z: unknown): z is undefined => (typeof z)[0] > 't';

/**
 * Equivalent to testing `'boolean' === typeof thing`
 */
export const is_boolean = (z: unknown): z is boolean => (typeof z)[3] > 'k';

/**
 * Equivalent to testing `'number' === typeof thing`
 */
export const is_number = (z: unknown): z is number => 'n' === (typeof z)[0];

/**
 * Equivalent to testing `'bigint' === typeof thing`
 */
export const is_bigint = (z: unknown): z is bigint => 'i' === (typeof z)[1];

/**
 * Equivalent to testing `'string' === typeof thing`
 */
export const is_string = (z: unknown): z is string => (typeof z)[2] > 'q';

/**
 * Equivalent to testing `'symbol' === typeof thing`
 */
export const is_symbol = (z: unknown): z is symbol => (typeof z)[1] > 'x';

/**
 * Equivalent to testing `'object' === typeof thing`
 */
export const is_object = (z: unknown): z is object => (typeof z)[1] < 'c';

/**
 * Equivalent to testing `'function' === typeof thing`
 */
export const is_function = (z: unknown): z is Function => (typeof z)[4] > 's';


/**
 * Simple test for whether a value is a Uint8Array or not
 */
export const is_bytes = (z: unknown): z is Uint8Array => z instanceof Uint8Array;

/**
 * Simple test for whether a value is an array or not
 */
export const is_array = <w_type=unknown>(z: unknown): z is Array<w_type> => Array.isArray(z);

/**
 * Simple test for whether a deserialized JSON value is a plain object (dict) or not
 */
export const is_dict = (z: unknown): z is JsonObject => z? is_object(z) && !is_array(z): false;

/**
 * Strict test for whether an ES object is a plain object (dict) or not
 */
export const is_dict_es = (z: unknown): z is JsonObject => Object === z?.constructor;

/**
 * Simple test for whether a value is iterable or not
 */
export const is_iterable = <w_type=unknown>(z: unknown): z is Iterable<w_type> => !!(z as any[] | undefined)?.[Symbol.iterator];

/**
 * Simple test for whether a value is iterable or not
 */
export const is_error = <h_extend extends object>(z: unknown): z is Error & h_extend => z instanceof Error;

/**
 * Typed alias for `Number.isFinite`
 */
export const is_finite = Number.isFinite as (z: unknown) => z is number;

/**
 * Typed alias for `Number.isInteger`
 */
export const is_integer = Number.isInteger as (z: unknown) => z is number;

/**
 * Typed alias for `Number.isSafeInteger`
 */
export const is_safe_integer = Number.isSafeInteger as (z: unknown) => z is number;

/**
 * Typed alias for `Number.isNaN`
 */
export const is_nan = Number.isNaN as (z: unknown) => z is number;



/**
 * Typed alias to `Array.from`
 */
export const array: <
	w_value,
>(a_in: Iterable<w_value>) => w_value[] = Array.from;


/**
 * Traverses an {@link Iterable}
 */
export const each: <
	w_value,
>(
	w_in: Iterable<w_value>,
	f_each: (w_value: w_value, i_each: number) => void,
) => void = (w_in, f_each) => array(w_in).forEach(f_each);


/**
 * Typed alias to `Object.create`
 */
export const create: <
	h_source extends object | null,
>(h_object: h_source, gc_props?: PropertyDescriptorMap) => object = Object.create;

/**
 * @deprecated Use {@link create} instead
 */
export const odc = create;


/**
 * Typed alias to `Object.assign`
 */
export const assign: <
	h_object extends {},
	h_extend extends {}=Partial<h_object>,
>(h_object: h_object, h_extend: h_extend) => h_object & h_extend = Object.assign;

/**
 * @deprecated Use {@link assign} instead
 */
export const oda = create;


/**
 * Typed alias to `Object.keys`
 */
export const keys: <
	w_src extends KeyValuable,
>(w_src: w_src) => StringKeysOf<w_src>[] = Object.keys;

/**
 * @deprecated Use {@link keys} instead
 */
export const odk = create;

/**
 * Typed alias to `Object.values`
 */
export const values: <
	w_src extends KeyValuable,
	z_values=ValuesOf<w_src>,
>(w_src: w_src) => z_values[] = Object.values;

/**
 * @deprecated Use {@link values} instead
 */
export const odv = create;

/**
 * Typed alias of `Object.entries`
 */
export const entries: <
	w_src extends KeyValuable,
	z_keys extends PropertyKey=StringKeysOf<w_src>,
	z_values=ValuesOf<w_src>,
>(w_src: w_src) => [z_keys, z_values][] = Object.entries;

/**
 * @deprecated Use {@link entries} instead
 */
export const ode = entries;

/**
 * Typed alias of `Object.fromEntries`
 */
export const from_entries: <
	as_keys extends PropertyKey,
	w_values extends any,
>(a_entries: Iterable<readonly [as_keys, w_values]>) => Record<as_keys, w_values> = Object.fromEntries;

/**
 * @deprecated Use {@link from_entries} instead
 */
export const ofe = from_entries;


/**
 * Map object entries. Alias of:
 * ```ts
 * w_obj => Object.entries(w_obj).map(f_map)
 * ```
 */
export const map_entries = <
	w_out extends any,
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
>(
	w_src: w_src,
	f_map: (a_entry: [z_keys, z_values], i_index: number, a_all: [z_keys, z_values][]) => w_out
): w_out[] => entries<w_src, z_keys, z_values>(w_src).map(f_map);

/**
 * @deprecated Use {@link map_entries} instead
 */
export const odem = map_entries;


/**
 * Filter an object's entries to form a new object. Equivalent to:
 * ```ts
 * w_obj => Object.fromEntries(Object.entries(w_obj).filter(f_filter))
 * ```
 * @param w_src - value that will get passed to `Object.entries`
 * @param f_filter - callback having signature `(key, value, index) => boolean`
 * @returns a new object containing only the entries approved by {@link f_filter}
 */
export const filter_object = <
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
>(
	w_src: w_src,
	f_filter: (si_key: z_keys, w_value: z_values, i_index: number) => AnyBoolish | null
): Record<z_keys, z_values | undefined> => from_entries<z_keys, z_values | undefined>(entries<w_src, z_keys, z_values>(w_src).filter(f_filter as () => boolean));


/**
 * Reduce an object to an arbitrary type by its entries. Alias of
 * ```ts
 * w_obj => Object.entries(w_obj).reduce(f_reduce)
 * ```
 */
export const reduce_object = <
	w_out extends any,
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
>(
	w_src: w_src,
	f_reduce: (w_prev: w_out, a_entry: [z_keys, z_values], i_index: number, a_all: [z_keys, z_values][]) => w_out,
	w_init: w_out
): w_out => entries<w_src, z_keys, z_values>(w_src).reduce(f_reduce, w_init);

/**
 * @deprecated Use {@link reduce_object} instead
 */
export const oder = reduce_object;

/**
 * Reduce an object's entries to an array via concatenation (with filtering)
 * @param w_src - value that will get passed to `Object.entries`
 * @param f_concat - callback having signature `(key, value, index) => item`
 * @param b_keep_undefs - by default, `undefined` items will be ommitted from return array unless this is truthy
 * @param a_out - optionally specifies the output array to merge items into
 * @returns an array of the `item` returned by {@link f_concat}
 */
export const concat_entries = <
	w_out extends any,
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
	b_keep_undefs extends AnyBoolish=AnyBoolish,
>(
	w_src: w_src,
	f_concat: (si_key: z_keys, w_value: z_values, i_entry: number) => w_out,
	b_keep_undefs: b_keep_undefs=0 as b_keep_undefs,
	a_out: w_out[]=[]
): NoInfer<IfBoolishTrue<b_keep_undefs, w_out, NonNullable<w_out>>[]> => reduce_object<
	IfBoolishTrue<b_keep_undefs, w_out, NonNullable<w_out>>[], w_src, z_keys, z_values
>(w_src, (a_acc, [si_key, w_value], i_entry) => {
	// invoke callback and capture return value
	const w_add = f_concat(si_key, w_value, i_entry);

	// add result to array iff not undefined or if undefined values are explictly allowed
	if(__UNDEFINED !== w_add || b_keep_undefs) a_acc.push(w_add as IfBoolishTrue<b_keep_undefs, w_out, NonNullable<w_out>>);

	return a_acc;
}, a_out as IfBoolishTrue<b_keep_undefs, w_out, NonNullable<w_out>>[]);

/**
 * @deprecated Use {@link concat_entries} instead
 */
export const oderac = concat_entries;


/**
 * Reduce object entries to an array via flattening (i.e., callback return value will be spread into array)
 * @param w_src - value that will get passed to `Object.entries`
 * @param f_concat - callback having signature `(key, value, index) => Iterable<item>`
 * @param a_out - optionally specifies the output array to merge items into
 * @returns an array of the `item` returned by {@link f_concat}
 */
export const flatten_entries = <
	w_out extends any,
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
>(
	w_src: w_src,
	f_concat: (si_key: z_keys, w_value: z_values, i_entry: number) => Iterable<w_out>,
	a_out: w_out[]=[] as w_out[]
): NoInfer<w_out[]> => reduce_object<w_out[], w_src, z_keys, z_values>(w_src, (a_acc, [si_key, w_value], i_entry) => [
	...a_acc,
	...f_concat(si_key, w_value, i_entry),
], a_out);

/**
 * @deprecated Use {@link flatten_entries} instead
 */
export const oderaf = flatten_entries;


/**
 * Transform an object to an object by its entries via merging (i.e., callback return value will be spread into object)
 * @param w_src - value that will get passed to `Object.entries`
 * @param f_merge - callback having signature `(key, value, index) => object`
 * @param h_out - optionally specifies the output object to merge properties into
 * @returns all `item` values returned by {@link f_merge} merged into a single object
 */
export const transform_object = <
	h_out extends object,
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
>(
	w_src: w_src,
	f_merge: (si_key: z_keys, w_value: z_values, i_index: number) => h_out,
	h_out: h_out={} as h_out
): NoInfer<h_out> => reduce_object<h_out, w_src, z_keys, z_values>(w_src, (h_acc, [si_key, w_value], i_index) => ({
	...h_acc,
	...f_merge(si_key, w_value, i_index),
}), h_out);

/**
 * @deprecated Use {@link transform_object} instead
 */
export const oderom = transform_object;

/**
 * Transforms an object by applying the given callback to each of its values, returning a new object
 * with the same keys as the original object
 * @param w_src - value that will get passed to `Object.entries`
 * @param f_transform - callback having signature `(value, key, index) => new_value`
 * @returns the new object
 */
export const transform_values = <
	w_out extends any,
	w_src extends KeyValuable=KeyValuable,
	z_keys extends StringKeysOf<w_src>=StringKeysOf<w_src>,
	z_values extends ValuesOf<w_src>=ValuesOf<w_src>,
>(
	w_src: w_src,
	f_transform: (w_value: z_values, si_key: z_keys, i_entry: number) => w_out
): NoInfer<{
	[si_key_out in z_keys]: w_out;
}> => from_entries(
	map_entries<[z_keys, w_out], w_src, z_keys, z_values>(w_src, ([si_key, w_value], i_entry) => [si_key, f_transform(w_value, si_key, i_entry)])
) as {
	[si_key_out in z_keys]: w_out;
};

/**
 * @deprecated Use {@link transform_values} instead
 */
export const fodemtv = transform_values;


/**
 * Fold an array into an object via reduction, i.e., by transforming each value into an object and merging it into a single output.
 * 
 * Useful when the number of output entries per input entry can vary. For 1:1 multiplicity see also {@link collapse}.
 * 
 * Example:
 * ```ts
 * // turn a list of strings into a dict
 * fold(['a', 'b', 'c'], (value, index) => ({[value]: index}))
 * // output: {a:0, b:1, c:2}
 * ```
 * 
 * The return type is dynamically constructed with the following precedence:
 *  - 1. from explicit type arguments if given `fold<IterableItemValue, OutputKey, OutputValue>(...)`
 *  - 2. from the type of the {@link h_out} argument if it was defined
 *  - 3. from the return type of the {@link f_fold} callback
 * @param w_in - the {@link Iterable} input
 * @param f_fold - transforming callback function with signature
 *    ```ts
 *    type f_fold = (z_value: w_value, i_each: number) => Record<z_keys, w_value>
 *    ```
 * @param h_out - optionally specify the output object, an existing object to merge properties into
 * @returns the merged output object
 */
export const fold = <
	w_value,
	z_keys extends PropertyKey=string,
	w_out=any,
	h_output extends Record<z_keys, w_out> | undefined=Record<z_keys, w_out> | undefined,
	h_returned extends Record<z_keys, w_out>=Record<z_keys, w_out>,
	h_dest=undefined extends h_output
		? h_returned
		: h_output,
>(
	w_in: Iterable<w_value>,
	f_fold: (z_value: w_value, i_each: number) => h_returned,
	h_out: h_output={} as h_output
): h_dest => array(w_in).reduce((h_acc, z_each, i_each) => assign(h_acc!, f_fold(z_each, i_each)) as unknown as h_output, h_out) as unknown as h_dest;


/**
 * Collapse an array into an object by mapping its items into entries
 * 
 * Example:
 * ```ts
 * // turn a list of strings into a dict
 * collapse(['a', 'b', 'c'], (value, index) => [value, index])
 * // output: {a:0, b:1, c:2}
 * ```
 * 
 * The return type is dynamically constructed with the following precedence:
 *  - 1. from explicit type arguments if given `fold<IterableItemValue, OutputKey, OutputValue>(...)`
 *  - 2. from the type of the {@link h_out} argument if it was defined
 *  - 3. from the return type of the {@link f_fold} callback
 * @param w_in - the {@link Iterable} input
 * @param f_collapse - transforming callback function with signature
 *    ```ts
 *    type f_collapse = (z_value: w_value, i_each: number) => Record<z_keys, w_value>
 *    ```
 * @returns the merged output object
 */
export const collapse = <
	w_value,
	z_keys extends PropertyKey=string,
	z_values=any,
>(
	w_in: Iterable<w_value>,
	f_collapse: (z_value: w_value, i_each: number) => [z_keys, z_values]
): Record<z_keys, z_values> => from_entries(array(w_in).map(f_collapse));


/**
 * Creates a new array by inserting an item in between every existing item
 */
export const interjoin = <
	w_item extends any,
	w_insert extends any,
>(a_input: readonly w_item[], w_insert: w_insert): Array<w_item | w_insert> => {
	const a_output: Array<w_item | w_insert> = [];

	for(let i_each=0, nl_items=a_input.length; i_each<nl_items-1; i_each++) {
		a_output.push(a_input[i_each]);
		a_output.push(w_insert);
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	if(a_input.length) a_output.push(a_input.at(-1)!);

	return a_output;
};

/**
 * Creates a copy of the original array with duplicates removed, keeping only the first occurrence of each value.
 * Optionally accepts an identity argument for deduplicating lists of objects using a key or callback function.
 * @param a_items - the items to deduplicate
 * @param z_identify - defines how to identify items in the list
 *  - if given a string, specifes the key of each item whose value should be used to identify it
 *  - if given a function, used as a callback to produce the comparison key
 *  - if omitted, compares items using strict equality
 * @returns the new array
 */
export const deduplicate = <
	z_item extends any,
	s_key extends keyof z_item=keyof z_item,
>(a_items: readonly z_item[], z_identify?: s_key | ((z_item: z_item) => any)): typeof a_items => {
	// compare items exactly by default
	let a_keys: readonly any[] = a_items;

	// identify argument
	if(z_identify) {
		// use object property
		if(is_string(z_identify)) {
			a_keys = a_items.map(w => w[z_identify]);
		}
		// use identity function
		else if(is_function(z_identify)) {
			a_keys = a_items.map(z_identify);
		}
		else {
			throw new TypeError(`Invalid identifier argument value: ${String(z_identify)}`);
		}
	}

	// prep keys set
	const as_keys = new Set<any>();

	// prep output
	const a_unique: z_item[] = [];

	// each item in list
	for(let i_item=0, nl_items=a_items.length; i_item<nl_items; i_item++) {
		const w_key = a_keys[i_item];

		// already in set; skip
		if(as_keys.has(w_key)) continue;

		// add to keys set
		as_keys.add(w_key);

		// add to items
		a_unique.push(a_items[i_item]);
	}

	return a_unique;
};


/**
 * Generate a random int within a given range
 */
export const random_int = (x_a: number, x_b = 0): number => {
	const x_min = Math.floor(Math.min(x_a, x_b));
	const x_max = Math.ceil(Math.max(x_a, x_b));

	// confine to range
	return Math.floor(Math.random() * (x_max - x_min)) + x_min;
};


/**
 * Shuffles an array in-place and returns it
 */
export const shuffle = <
	w_list extends Array<any> | TypedArray,
// eslint-disable-next-line @typescript-eslint/naming-convention
>(a_items: w_list, f_random=random_int): w_list => {
	let i_item = a_items.length;

	while(i_item > 0) {
		const i_swap = f_random(--i_item);
		const w_item = a_items[i_item];
		a_items[i_item] = a_items[i_swap];
		a_items[i_swap] = w_item;
	}

	return a_items;
};

/**
 * Removes the first occurrence of the given item from the array in-place and returns the array
 * @param a_items 
 * @param w_item 
 * @returns 
 */
export const remove = <w_item>(a_items: w_item[], w_item: w_item): w_item[] => {
	const i_item = a_items.indexOf(w_item);
	if(i_item >= 0) a_items.splice(i_item, 1);
	return a_items;
};

/**
 * Commonly used reducer function to compute sum of a list numbers
 * @param a_values - list of values to sum
 * @returns the sum
 */
export const sum = (a_values: number[]): number => a_values.reduce((x_a, x_b) => x_a + x_b, 0);

/**
 * Reducer function to compute product of a list numbers
 * @param a_values - list of values to multiply
 * @returns the sum
 */
export const product = (a_values: number[]): number => a_values.reduce((x_a, x_b) => x_a * x_b, 0);

/**
 * Normalizes a list numbers
 * @param a_values - list of values to normalize
 * @returns a new array representing the normalized values
 */
export const normalize = (a_values: number[], x_sum=sum(a_values) as never): number[] => a_values.map(x => x / x_sum);

/**
 * Throws an error, accepting an optional piece of data to attach to the object
 * @param s_msg 
 * @param w_data 
 */
export const die = (s_msg: string, w_data?: unknown): never => {
	throw assign(Error(s_msg), {data:w_data});
};

/**
 * Synchronously try the given callback, returning a tuple of the result or error
 * @param f_try - synchronous callback function
 * @returns a tuple where:
 *   - 0: the value returned by callback function if it did not throw, otherwise `undefined`
 *   - 1: the error thrown by the callback function, if any, otherwise `undefined`
 */
export const try_sync = <
	w_return,
	w_error,
>(f_try: (_?: void) => w_return): [w_return, 0] | [undefined, InsteadOfAny<w_error, unknown>] => {
	try {
		return [f_try(), 0];
	}
	catch(e_fail) {
		return [__UNDEFINED, e_fail as w_error];
	}
};

/**
 * Asynchronously try the given callback, returning a tuple of the result or error
 * @param f_try - asynchronous callback function
 * @returns a tuple where:
 *   - 0: the awaited value returned by callback function if it did not throw, otherwise `undefined`
 *   - 1: the error thrown by the callback function, if any, otherwise `undefined`
 */
export const try_async = async<w_error, w_return>(f_try: () => Promisable<w_return>): Promise<[w_return, 0] | [undefined, w_error]> => {
	try {
		return [await f_try(), 0];
	}
	catch(e_fail) {
		return [__UNDEFINED, e_fail as w_error];
	}
};

/**
 * Takes the given value and calls the given function with it as the first and only argument
 * @param w_value 
 * @param f_action 
 * @returns 
 */
export const call_with = <w_value, w_return>(w_value: w_value, f_action: (w_use: w_value) => w_return): w_return => f_action(w_value);


