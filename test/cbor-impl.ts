import {describe, expect, test} from 'bun:test';

import {cbor_decode_trivial} from '../dist/mjs/cbor';
import {bytes, text_to_bytes} from '../dist/mjs/data';

describe('CBOR decoder', () => {
	test('honors Uint8Array offsets', () => {
		// wrap encoded integer with unrelated bytes
		const atu8_wrapped = bytes([0xff, 0x18, 0x2a, 0xff]);

		// decode only interior slice
		const [x_value, ib_read] = cbor_decode_trivial<number>(atu8_wrapped.subarray(1, 3));

		// verify decoded value
		expect(x_value).toBe(42);

		// verify relative read position
		expect(ib_read).toBe(2);
	});

	test('decodes unsigned 64-bit integers as bigint', () => {
		// encode integer above safe number range
		const atu8_encoded = bytes([0x1b, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);

		// decode integer
		const [xg_value, ib_read] = cbor_decode_trivial<bigint>(atu8_encoded);

		// verify exact bigint value
		expect(xg_value).toBe(9_007_199_254_740_993n);

		// verify read position
		expect(ib_read).toBe(9);
	});

	test('decodes negative 64-bit integers as bigint', () => {
		// encode negative integer below safe number range
		const atu8_encoded = bytes([0x3b, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);

		// decode integer
		const [xg_value] = cbor_decode_trivial<bigint>(atu8_encoded);

		// verify exact bigint value
		expect(xg_value).toBe(-9_007_199_254_740_994n);
	});

	test('decodes standard date-time tags as timestamps', () => {
		// encode tag zero and text payload
		const atu8_encoded = bytes([0xc0, 0x74, ...text_to_bytes('2013-03-21T20:04:00Z')]);

		// decode timestamp
		const [xt_value, ib_read] = cbor_decode_trivial<number>(atu8_encoded);

		// verify parsed timestamp
		expect(xt_value).toBe(Date.parse('2013-03-21T20:04:00Z'));

		// verify read position
		expect(ib_read).toBe(22);
	});
});
