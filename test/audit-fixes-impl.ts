import {spawnSync} from 'node:child_process';

import {describe, expect, test} from 'bun:test';

import {
	XG_16,
	XG_32,
	oda,
	odk,
	odv,
	product,
} from '../dist/mjs/belt';
import {gzip_bytes, gunzip_bytes} from '../dist/mjs/compression';
import {
	bigint_max,
	bigint_min,
	bytes,
	crypto_random_int,
	text_to_bytes,
	uuid_v4,
} from '../dist/mjs/data';
import {MutexPool} from '../dist/mjs/mutex-pool';
import {NanoBuffer} from '../dist/mjs/nano-buffer';

describe('corrected utility exports', () => {
	test('bigint constants match their names', () => {
		expect(XG_16).toBe(16n);
		expect(XG_32).toBe(32n);
	});

	test('deprecated object aliases target the documented operations', () => {
		// eslint-disable-next-line @typescript-eslint/no-deprecated -- the deprecated alias itself is under regression test
		expect(oda({a:1}, {b:2})).toEqual({a:1, b:2});
		// eslint-disable-next-line @typescript-eslint/no-deprecated -- the deprecated alias itself is under regression test
		expect(odk({a:1, b:2})).toEqual(['a', 'b']);
		// eslint-disable-next-line @typescript-eslint/no-deprecated -- the deprecated alias itself is under regression test
		expect(odv({a:1, b:2})).toEqual([1, 2]);
	});

	test('product and bigint extrema use neutral/input initial values', () => {
		expect(product([2, 3, 4])).toBe(24);
		expect(product([])).toBe(1);
		expect(bigint_max([-5n, -2n])).toBe(-2n);
		expect(bigint_min([5n, 2n])).toBe(2n);
	});
});

describe('secure random helpers', () => {
	test('uuid_v4 emits an RFC 4122 version 4 UUID', () => {
		expect(uuid_v4()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u);
	});

	test('uuid_v4 fallback uses secure bytes and standard separators', () => {
		const g_result = spawnSync('node', [
			'--input-type=module',
			'-e',
			"Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues:a=>(a.fill(0),a)}}); import('./dist/mjs/data.js').then(({uuid_v4}) => process.stdout.write(uuid_v4()))",
		], {
			cwd: process.cwd(),
			encoding: 'utf8',
		});

		expect(g_result.status).toBe(0);
		expect(g_result.stdout).toBe('00000000-0000-4000-8000-000000000000');
	});

	test('crypto_random_int stays within its half-open range', () => {
		for(let i_sample=0; i_sample<1e3; i_sample++) {
			const x_random = crypto_random_int(-7, 13);
			expect(Number.isInteger(x_random)).toBe(true);
			expect(x_random).toBeGreaterThanOrEqual(-7);
			expect(x_random).toBeLessThan(13);
		}
	});

	test('crypto_random_int rejects empty or unsafe ranges', () => {
		expect(() => crypto_random_int(1, 1)).toThrow('at least one integer');
		expect(() => crypto_random_int(Infinity)).toThrow('finite safe integers');
	});
});

describe('compression availability', () => {
	test('gzip round trips bytes', async() => {
		const atu8_data = text_to_bytes('belt compression regression');
		expect(await gunzip_bytes(await gzip_bytes(atu8_data))).toEqual(atu8_data);
	});

	test('root import is lazy when compression APIs are unavailable', () => {
		const g_result = spawnSync('node', [
			'--input-type=module',
			'-e',
			"globalThis.CompressionStream=undefined; globalThis.DecompressionStream=undefined; import('./dist/mjs/main.js').then(() => process.stdout.write('loaded'))",
		], {
			cwd: process.cwd(),
			encoding: 'utf8',
		});

		expect(g_result.status).toBe(0);
		expect(g_result.stdout).toBe('loaded');
	});
});

describe('constructor validation', () => {
	test('NanoBuffer rejects invalid segment sizes', () => {
		for(const nb_size of [0, -1, 1.5, Infinity]) {
			expect(() => NanoBuffer(nb_size)).toThrow(RangeError);
		}
	});

	test('NanoBuffer still accepts positive segment sizes', () => {
		const k_buffer = NanoBuffer(2);
		k_buffer.a(bytes([1, 2, 3]));
		expect(k_buffer.o()).toEqual(bytes([1, 2, 3]));
	});

	test('MutexPool rejects invalid capacities', () => {
		for(const n_capacity of [0, -1, 1.5, Infinity]) {
			expect(() => MutexPool(n_capacity)).toThrow(RangeError);
		}
	});
});
