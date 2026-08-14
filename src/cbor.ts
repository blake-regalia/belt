/* eslint-disable prefer-const, @typescript-eslint/naming-convention */

import {__UNDEFINED, is_bigint} from './belt.js';
import {bytes_to_biguint_be, bytes_to_text, dataview_from} from './data.js';

/**
 * Primitive CBOR datatype
 */
export type CborPrimitive = undefined | null | boolean | number | bigint | string | Uint8Array;

type CborArray = CborValue[];

type CborMap = Map<CborValue, CborValue>;

/**
 * Any CBOR value
 */
export type CborValue = CborPrimitive | CborArray | CborMap;

/**
 * Decodes a CBOR buffer into its ES equivalent. It does not support floating point numbers.
 * 
 * Please note that only a specific subset of tags are supported: {@link https://www.rfc-editor.org/rfc/rfc8949.html#name-tagging-of-items}
 *  - 3.4.1. Standard Date/Time String - decoded as `number`
 *  - 3.4.2. Epoch-Based Date/Time - decoded as `number`
 *  - 3.4.3. Bignums - decoded as `bigint`
 * 
 * @param atu8_data 
 * @param ib_read 
 * @returns a tuple of the decoded value and number of bytes read: `[z_value:`{@link CborValue `CborValue`}`, nb_read: number]`
 */
export const cbor_decode_trivial = <
	w_expected extends CborValue,
>(atu8_data: Uint8Array, ib_read=0): [
	w_item: w_expected,
	ib_read: number,
] => {
	// read initial byte
	let xb_initial = atu8_data[ib_read++];

	// extract additional information
	let xc_additional = xb_initial & 0x1f;

	// extract major type
	let xc_major = xb_initial >> 5;

	// only used in next if block, but placed in outer scope join declaration sequence
	let nb_ahead = 1 << (xc_additional - 24);

	// create view relative to input slice
	let dv_data = dataview_from(atu8_data);

	// default to low uint value
	let xz_value: number | bigint = xc_additional;

	// additional integer bytes follow
	if(xc_additional > 23) {
		// read network-order bytes
		xz_value = dv_data['get'+(8 === nb_ahead? 'Big': '')+'Uint'+(8*nb_ahead) as 'getUint8' | 'getUint16' | 'getUint32' | 'getBigUint64'](ib_read);

		// advance past integer
		ib_read += nb_ahead;
	}

	// coerce value for lengths and parser selection
	let xn_value = Number(xz_value);

	// define major type parsers
	let a_parsers = [
		// uint
		(_?: any) => xz_value,

		// negative int
		// @ts-expect-error type guard doesn't narrow in closure context
		(_?: any) => -xz_value - (is_bigint(xz_value)? 1n: 1),

		// byte string
		(_?: any) => atu8_data.subarray(ib_read, ib_read+=xn_value),

		// text string
		(_?: any) => bytes_to_text(a_parsers[2]()),

		// array
		(a_items: CborValue[]=[]) => {
			// decode each item
			for(let i_item=0; i_item<xn_value; i_item++) {
				// decode item and advance read position
				[a_items[i_item], ib_read] = cbor_decode_trivial(atu8_data, ib_read);
			}

			// return decoded items
			return a_items;
		},

		// map
		(hm_out=new Map<CborValue, CborValue>()) => {
			// decode each entry
			for(let i_item=0, z_key, z_value; i_item<xn_value; i_item++) {
				// decode key and advance read position
				[z_key, ib_read] = cbor_decode_trivial(atu8_data, ib_read);

				// decode value and advance read position
				[z_value, ib_read] = cbor_decode_trivial(atu8_data, ib_read);

				// save entry to map
				hm_out.set(z_key, z_value);
			}

			// return decoded map
			return hm_out;
		},

		// tagged item
		(z_payload?: unknown) => [
			// date/time string
			(_?: any) => Date.parse(z_payload as string),

			// epoch-based date/time as number of seconds (integer or float)
			(_?: any) => z_payload as number,

			// unsigned bigint
			(_?: any) => bytes_to_biguint_be(z_payload as Uint8Array),

			// negative bigint
			(_?: any) => -bytes_to_biguint_be(z_payload as Uint8Array) - 1n,
		][xc_additional]([z_payload, ib_read]=cbor_decode_trivial(atu8_data, ib_read)),

		// major type 7
		(__?: any) => [
			false,
			true,
			null,
			__UNDEFINED,
		][xc_additional-20],
	] as const;
	/* eslint-enable */

	// return decoded item and read position
	return [
		a_parsers[xc_major]() as w_expected,
		ib_read,
	];
};
