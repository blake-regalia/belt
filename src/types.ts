import type {A, O, U} from 'ts-toolbelt';

// would much prefer to use Symbol here, but TypeScript treats them as different types
// if dependency versions don't align
/* eslint-disable @typescript-eslint/naming-convention */
export const TYPE_ID = '__TYPE_ID';
export const ES_TYPE = '__ES_TYPE';
/* eslint-enable */

/**
 * Test whether a given type value is the `any` type. Returns `1` if true, `0` otherwise
 */
export type IsLiteralAny<w_test> = 0 extends (1 & w_test)? 1 : 0;

/**
 * If the given type value is the `any` type, use the given substitute type instead
 */
export type InsteadOfAny<w_test, w_instead> = 0 extends (1 & w_test)? w_instead : w_test;

/**
 * Create subtype on any type using intersection. Can be removed later using {@link Unsubtype}
 */
export type Subtype<w_type, w_id> = {
	[TYPE_ID]: w_id;
	[ES_TYPE]: w_type;
} & w_type;

/**
 * Removes subtype
 */
export type Unsubtype<w_type> = w_type extends {[ES_TYPE]: infer w_actual}? w_actual: never;

/**
 * Accesses the given string key on the given struct if it exists
 */
export type Access<
	g_struct extends {},
	si_key extends string,

> = g_struct extends {
	[si in si_key]: infer w_value
}? w_value: undefined;


type UnionKeys<h_types> = h_types extends any? keyof U.IntersectOf<h_types>: never;

/**
 * Takes a union of objects and makes it so that each object includes keys from the other
 * objects in the union, giving them optional types of `undefined` so that they can be
 * used in discriminated union tests.
 */
export type DiscriminatedUnion<h_types, h_clone=h_types> = h_types extends any
	? UnionKeys<h_clone> extends infer as_keys
		? {
			[si_each in keyof h_types]: Record<si_each, h_types[si_each]> & Partial<Record<Exclude<A.Cast<as_keys, A.Key>, si_each>, undefined>>
		}[keyof h_types]
		: never
	: never;


/**
 * Shortcut for a very common type pattern
 */
export type Dict<w_value=string> = Record<string, w_value>;


/**
 * Shortcut for another common type pattern
 */
export type Promisable<w_value=unknown> = w_value | Promise<w_value>;

/**
 * Shortcut for another common type pattern
 */
export type Arrayable<w_value> = w_value | w_value[];

/**
 * Shortcut for another common type pattern
 */
export type NestedArrayable<w_value> = w_value | NestedArrayable<w_value>[];

/**
 * Shortcut for another common type pattern
 */
export type Nilable<w_value> = w_value | null | undefined;

/**
 * Shortcut for another common type pattern
 */
export type Falsible<w_value> = Nilable<w_value> | 0 | false | '';

/**
 * Types that can be accessed via index operator `[key]`
 */
export type KeyValuable = Record<PropertyKey, any> | ArrayLike<any>;

/**
 * Returns the string keys of the given type, returning `${bigint}` for Array since its keys satisfy `${bigint}`
 */
export type StringKeysOf<w_type> = w_type extends ArrayLike<any>
	? `${bigint}`
	: w_type extends Record<infer z_key, any>
		? z_key extends string
			? z_key
			: z_key extends number
				? `${number}`
				: z_key extends bigint
					? `${bigint}`
					: z_key extends boolean | null | undefined
						? `${z_key}`
						: never
		: never;


/**
 * Returns the values of the given type, extracting the values of an Array, or the properties of an Object.
 */
export type ValuesOf<w_type> = w_type extends ArrayLike<infer w_value>? w_value: w_type[keyof w_type];

/**
 * Returns the values of the given type, extracting the properties of an Object having string keys.
 */
export type ValuesOfStruct<h_struct extends Record<string, any>> = h_struct[Extract<keyof h_struct, string>];

/**
 * Union of all TypedArray types
 */
export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array;

/**
 * JSON string
 */
export type NaiveJsonString<
	s_subtype extends string=string,
> = Subtype<s_subtype, 'json'>;



/**
 * Root type for all objects considered to be parsed JSON objects
 */

export type JsonObject<w_inject extends any=never> = {
	[k: string]: JsonValue<w_inject>;
};

/**
 * Union of "valuable", primitive JSON value types
 */
export type JsonPrimitive =
	| boolean
	| number
	| string;

/**
 * All primitive JSON value types
 */
export type JsonPrimitiveNullable<w_inject extends any=never> =
	| JsonPrimitive
	| null
	| w_inject;

/**
 * JSON Array
 */
export type JsonArray<w_inject extends any=never> = JsonValue<w_inject>[] | readonly JsonValue<w_inject>[];

/**
 * All JSON value types
 */
export type JsonValue<w_inject extends any=never> =
	| JsonPrimitiveNullable<w_inject>
	| JsonArray<w_inject>
	| JsonObject<w_inject>
	| Arrayable<undefined>;

/**
 * Removes JSON interfaces from a type
 */
export type RemoveJsonInterfaces<w_type> = Exclude<A.Compute<Exclude<Extract<w_type, object>, JsonArray>>, JsonObject>;

/**
 * Reinterprets the given type as being JSON-compatible
 */
export type AsJson<
	z_test extends JsonValue<w_inject> | {} | {}[],
	w_inject extends unknown=never,
> = z_test extends JsonValue<w_inject>? z_test
	: z_test extends Array<infer w_type>
		? AsJson<w_type, w_inject>[]
		: z_test extends Record<never, any>
			? boolean | number | string extends z_test
				// the `{}` type
				? JsonObject
				// something object-y
				: {
					[si_each in keyof z_test]: AsJson<z_test[si_each], w_inject>;
				}
			: {
				[si_each in keyof z_test]: AsJson<z_test[si_each], w_inject>;
			};

// augment global functions
declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface JSON {
		/**
		 * Converts a JavaScript Object Notation (JSON) string into an object.
		 * @param text A valid JSON string.
		 * @param reviver A function that transforms the results. This function is called for each member of the object.
		 * If a member contains nested objects, the nested objects are transformed before the parent object is.
		 */
		parse<
			w_revive=never,
		>(text: string, reviver?: (this: any, key: string, value: any) => w_revive): JsonValue<w_revive>;

		/**
		 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
		 * @param value A JavaScript value, usually an object or array, to be converted.
		 * @param replacer A function that transforms the results.
		 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
		 */
		stringify<
			s_subtype extends string,
		>(value: any, replacer?: Nilable<(this: any, key: string, value: any) => any>, space?: string | number): NaiveJsonString<s_subtype>;

		/**
		 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
		 * @param value A JavaScript value, usually an object or array, to be converted.
		 * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
		 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
		 */

		stringify<
			s_subtype extends string,
		>(value: any, replacer?: (number | string)[] | null, space?: string | number): NaiveJsonString<s_subtype>;
	}

	// interface ObjectConstructor {
	// 	/**
	// 	 * Returns the names of the enumerable string properties and methods of an object.
	// 	 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
	// 	 */
	// 	keys<z_obj extends {}>(o: z_obj): z_obj extends Record<infer as_keys, any>? as_keys[]: string[];
	// }
}

/**
 * Anything that is plainly boolish, including undefined
 */
export type AnyBoolish = 0 | 1 | boolean | undefined;

export type IfBoolishTrue<
	b_boolish extends AnyBoolish,
	w_then,
	w_else,
> = [b_boolish] extends [0 | false | undefined]
	? w_else
	: [AnyBoolish] extends [b_boolish]
		? w_else
		: w_then;
