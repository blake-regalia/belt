import type {NaiveBase64} from 'dist/mjs/strings';

import {describe, test, expect} from 'bun:test';

import {
	cast,
} from '../dist/mjs/belt';

import {
	concat,
	bytes,
	bytes_to_hex,
	hex_to_bytes,
	bytes_to_biguint_be,
	biguint_to_bytes_be,
	canonicalize_json,
	bytes_to_text,
	text_to_bytes,
	bytes_to_base58,
	base58_to_bytes,
	bytes_to_base64,
	base64_to_bytes,
	text_to_base64,
	base64_to_text,
	bytes_to_base64_slim,
	base64_to_bytes_slim,
	bytes_to_base93,
	base93_to_bytes,
	sha256,
	sha512,
	encode_length_prefix_u16,
	decode_length_prefix_u16,
} from '../dist/mjs/data';
import { bytes_to_string8 } from 'src/data';



describe('biguint_to_bytes_be + bytes_to_biguint_be', () => {
	const hm_expect = new Map([
		[0n, [0]],
		[1n, [1]],
		[2n, [2]],

		[0x7en, [0x7e]],
		[0x7fn, [0x7f]],
		[0x80n, [0x80]],
		[0x81n, [0x81]],
		[0xffn, [0xff]],
		[0x100n, [0x01, 0x00]],
		[0x101n, [0x01, 0x01]],
		[0x10fn, [0x01, 0x0f]],
		[0x110n, [0x01, 0x10]],
		[0x1ffn, [0x01, 0xff]],
		[0x200n, [0x02, 0x00]],

		[0xfedcba9876543210n, [0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10]],
	]);

	for(const [xg_in, a_out] of hm_expect.entries()) {
		const atu8_expect = bytes(32);
		atu8_expect.set(a_out, 32-a_out.length);
		const atu8_actual = biguint_to_bytes_be(xg_in);

		const sb16_data = bytes_to_hex(atu8_expect).replace(/^(00)+(?=\d)/, '');

		test(`${xg_in} => 0x${sb16_data}`, () => {
			expect(atu8_actual).toEqual(atu8_expect);
		});

		test(`0x${sb16_data} => ${xg_in}`, () => {
			expect(bytes_to_biguint_be(atu8_actual)).toEqual(xg_in);
		});
	}
});

describe('malformed binary data', () => {
	test('rejects biguint values outside output size', () => {
		// reject negative value
		expect(() => biguint_to_bytes_be(-1n, 1)).toThrow();

		// reject overflowing value
		expect(() => biguint_to_bytes_be(256n, 1)).toThrow();
	});

	test('rejects malformed hex', () => {
		// reject invalid digits
		expect(() => hex_to_bytes('zz')).toThrow();

		// reject incomplete byte
		expect(() => hex_to_bytes('0')).toThrow();
	});

	test('rejects malformed base encodings', () => {
		// reject invalid base58 digit
		expect(() => base58_to_bytes('!')).toThrow();

		// reject incomplete base64 sextet
		expect(() => base64_to_bytes('A')).toThrow();
	});

	test('round trips empty base58', () => {
		// encode and decode empty data
		expect(base58_to_bytes(bytes_to_base58(bytes(0)))).toEqual(bytes(0));
	});

	test('rejects overflowing or truncated uint16 frames', () => {
		// reject overflowing encoded length
		expect(() => encode_length_prefix_u16(bytes(0x10000))).toThrow();

		// reject payload shorter than declared length
		expect(() => decode_length_prefix_u16(bytes([0, 2, 1]))).toThrow();
	});
});

describe('canonicalize_json', () => {
	test('flat object', () => {
		expect(JSON.stringify(canonicalize_json({
			b: 'B',
			c: 'C',
			a: 'A',
		}))).toEqual(JSON.stringify({
			a: 'A',
			b: 'B',
			c: 'C',
		}));
	});

	test('object w/ depth=1', () => {
		expect(JSON.stringify(canonicalize_json({
			b: {
				y: 1,
				x: 0,
				z: 2,
			},
			c: 'C',
			a: 'A',
		}))).toEqual(JSON.stringify({
			a: 'A',
			b: {
				x: 0,
				y: 1,
				z: 2,
			},
			c: 'C',
		}));
	});

	test('order is preserved in array', () => {
		expect(JSON.stringify(canonicalize_json({
			b: ['Z', 'B', 'X'],
			c: 'C',
			a: 'A',
		}))).toEqual(JSON.stringify({
			a: 'A',
			b: ['Z', 'B', 'X'],
			c: 'C',
		}));
	});

	test('kitchend sink', () => {
		expect(JSON.stringify(canonicalize_json({
			false: false,
			true: true,
			2: 2,
			0: 0,
			1: 1,
			null: null,
			empty: '',
			string: 'string',
			array_0: [],
			array_1: ['array'],
			array_2: ['2', '1'],
			array_nest_strs: ['c', ['b', ['a']]],
			array_nest_obj: [{
				a: {
					z: [],
					b: {
						c: 'd',
					},
				},
			}],
			b: {
				z: [2, 1, {}],
				x: 0,
			},
		}))).toEqual(JSON.stringify({
			0: 0,
			1: 1,
			2: 2,
			array_0: [],
			array_1: ['array'],
			array_2: ['2', '1'],
			array_nest_obj: [{
				a: {
					b: {
						c: 'd',
					},
					z: [],
				},
			}],
			array_nest_strs: ['c', ['b', ['a']]],
			b: {
				x: 0,
				z: [2, 1, {}],
			},
			empty: '',
			false: false,
			null: null,
			string: 'string',
			true: true,
		}));
	});
});

describe('base64', () => {
	const h_tests_correct = {
		'b': 'Yg==',
		'bl': 'Ymw=',
		'bla': 'Ymxh',
		'blak': 'Ymxhaw==',
		'blake': 'Ymxha2U=',
		'\0': 'AA==',
		'\0\0': 'AAA=',
		'\0\0\0': 'AAAA',
		'\0\0\0\0': 'AAAAAA==',
		'👍✅': '8J+RjeKchQ==',
	};

	const h_tests_hex = {
		'2bf7cc2701fe4397b49ebeed5acc7090': 'K/fMJwH+Q5e0nr7tWsxwkA==',
	};

	const h_tests_fuzzy = {
		'Yg': 'b',
		'Yg=': 'b',
	};

	for(const [s_variant, f_encoder, f_decoder] of [
		['default', bytes_to_base64, base64_to_bytes],
		['slim', bytes_to_base64_slim, base64_to_bytes_slim],
	] as const) {
		for(const [s_input, s_output] of Object.entries(h_tests_correct)) {
			test(`${s_variant}/encode: ${s_input} => ${s_output}`, () => {
				expect(f_encoder(text_to_bytes(s_input))).toBe(cast<NaiveBase64>(s_output));
			});

			test(`${s_variant}/decode: ${s_output} => ${s_input}`, () => {
				expect(bytes_to_text(f_decoder(s_output))).toBe(s_input);
			});
		}

		for(const [s_input, s_output] of Object.entries(h_tests_hex)) {
			test(`${s_variant}/encode: 0x${s_input} => ${s_output}`, () => {
				expect(f_encoder(hex_to_bytes(s_input))).toBe(cast<NaiveBase64>(s_output));
			});

			test(`${s_variant}/decode: 0x${s_input} => ${s_output}`, () => {
				expect(bytes_to_hex(f_decoder(s_output))).toBe(s_input);
			});
		}

		for(const [s_output, s_input] of Object.entries(h_tests_fuzzy)) {
			test(`${s_variant}/decode: ${s_output} => ${s_input}`, () => {
				expect(bytes_to_text(f_decoder(s_output))).toBe(s_input);
			});
		}
	}
});

describe('noise', async() => {
	const atu8_noise = concat([
		await sha512(text_to_bytes('noise-0')),
		await sha512(text_to_bytes('noise-1')),
		await sha512(text_to_bytes('noise-2')),
		await sha512(text_to_bytes('noise-3')),
	]);

	const a_transcoders = [
		['base64-default', bytes_to_base64, base64_to_bytes],
		['base64-slim', bytes_to_base64_slim, base64_to_bytes_slim],
		['base58', bytes_to_base58, base58_to_bytes],
		['base93', bytes_to_base93, base93_to_bytes],
	] as const;

	for(const [s_variant, f_encoder, f_decoder] of a_transcoders) {
		test(`${s_variant}: @0-${atu8_noise.length}`, () => {
			// test all slices
			for(let i_slice=0; i_slice<atu8_noise.length; i_slice++) {
				const atu8_sample = atu8_noise.subarray(i_slice);

				expect(f_decoder(f_encoder(atu8_sample))).toEqual(atu8_sample);
			}
		});
	}
});
