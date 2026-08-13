// import {describe, expect, test} from '@jest/globals';
import {describe, test, expect} from 'bun:test';

import {
	F_IDENTITY,
	is_undefined,
	is_boolean,
	is_number,
	is_bigint,
	is_string,
	is_symbol,
	is_object,
	is_function,
	is_error,

	is_bytes,
	is_array,
	is_dict,
	is_dict_es,
	is_iterable,

	concat_entries,
	flatten_entries,
	transform_object,
	transform_values,
	fold,
	collapse,
	deduplicate,
	interjoin,
	shuffle,
	remove,

	die,
	try_sync,
	try_async,
} from '../dist/mjs/belt';

const h_typeofs = {
	// eslint-disable-next-line no-undefined
	undefined: undefined,
	boolean: false,
	number: 0,
	bigint: 0n,
	string: '',
	symbol: Symbol(''),
	object: {},
	function: () => {},
} as const;


const h_test = {
	a: 'A',
	b: 'B',
	c: 'C',
} as const;

const a_test = [
	'A',
	'B',
	'C',
] as const;

const expect_only = (f_test: (w_value: any) => boolean, si_expect?: keyof typeof h_typeofs) => {
	for(const [si_key, z_value] of Object.entries(h_typeofs)) {
		test(`on ${si_key} => ${si_key === si_expect}`, () => {
			expect(f_test(z_value)).toBe(si_key === si_expect);
		});
	}
};

describe('F_IDENTITY', () => {
	const d_symbol = Symbol('test');

	test('by reference', () => {
		expect(F_IDENTITY(d_symbol)).toBe(d_symbol);
	});
});

describe('typeofs', () => {
	describe('is_undefined', () => {
		expect_only(is_undefined, 'undefined');
	});

	describe('is_boolean', () => {
		expect_only(is_boolean, 'boolean');
	});

	describe('is_number', () => {
		expect_only(is_number, 'number');
	});

	describe('is_bigint', () => {
		expect_only(is_bigint, 'bigint');
	});

	describe('is_string', () => {
		expect_only(is_string, 'string');
	});

	describe('is_symbol', () => {
		expect_only(is_symbol, 'symbol');
	});

	describe('is_object', () => {
		expect_only(is_object, 'object');
	});

	describe('is_function', () => {
		expect_only(is_function, 'function');
	});
});

describe('is_bytes', () => {
	expect_only(is_bytes);

	test('Uint8Array => true', () => {
		expect(is_bytes(new Uint8Array(0))).toBe(true);
	});

	test('Buffer => true', () => {
		expect(is_bytes(Buffer.alloc(0))).toBe(true);
	});

	test('ArrayBuffer => false', () => {
		expect(is_bytes(new Uint8Array(0).buffer)).toBe(false);
	});
});

describe('is_array', () => {
	expect_only(is_array);

	test('[] => true', () => {
		expect(is_array([])).toBe(true);
	});

	test('Uint8Array => false', () => {
		expect(is_array(new Uint8Array(0))).toBe(false);
	});
});


describe('is_dict', () => {
	expect_only(is_dict, 'object');

	test('[] => false', () => {
		expect(is_dict([])).toBe(false);
	});

	test('Map => true', () => {
		expect(is_dict(new Map())).toBe(true);
	});
});

describe('is_dict_es', () => {
	expect_only(is_dict, 'object');

	test('[] => false', () => {
		expect(is_dict_es([])).toBe(false);
	});

	test('Map => false', () => {
		expect(is_dict_es(new Map())).toBe(false);
	});
});

describe('is_iterable', () => {
	test('"" => true', () => {
		expect(is_iterable('')).toBe(true);
	});

	test('{} => true', () => {
		expect(is_iterable([])).toBe(true);
	});

	test('[] => true', () => {
		expect(is_iterable([])).toBe(true);
	});

	test('Set => true', () => {
		expect(is_iterable(new Set())).toBe(true);
	});

	test('Map => true', () => {
		expect(is_iterable(new Map())).toBe(true);
	});

	test('Uint8Array => true', () => {
		expect(is_iterable(new Uint8Array())).toBe(true);
	});
});

describe('concat_entries', () => {
	test('{}', () => {
		expect(concat_entries({}, () => {})).toEqual([]);
	});

	test('[]', () => {
		expect(concat_entries([], () => {})).toEqual([]);
	});

	test('object filter undefined', () => {
		expect(concat_entries(h_test, (si_key, s_value, i_index) => 'a' !== si_key? `${i_index}:${s_value}`: void 0)).toEqual(['1:B', '2:C']);
	});

	test('array filter undefined', () => {
		expect(concat_entries(a_test, si_key => '0' !== si_key? '1': void 0)).toEqual(['1', '1']);
	});

	test('keep undefineds', () => {
		expect(concat_entries(h_test, si_key => 'a' !== si_key? '1': void 0, true)).toEqual([void 0, '1', '1']);
	});

	test('add to existing list', () => {
		expect(concat_entries(h_test, () => '1', false, ['2'])).toEqual(['2', '1', '1', '1']);
	});
});

describe('flatten_entries', () => {
	test('object', () => {
		expect(flatten_entries(h_test, (si_key, s_value, i_index) => [`${si_key}:${s_value}:${i_index}`])).toEqual([
			'a:A:0',
			'b:B:1',
			'c:C:2',
		]);
	});

	test('array', () => {
		expect(flatten_entries(a_test, (si_key, s_value, i_index) => [`${si_key}:${s_value}:${i_index}`])).toEqual([
			'0:A:0',
			'1:B:1',
			'2:C:2',
		]);
	});

	test('add to existing list', () => {
		expect(flatten_entries(h_test, (si_key, s_value, i_index) => [`${si_key}:${s_value}:${i_index}`], ['nil'])).toEqual([
			'nil',
			'a:A:0',
			'b:B:1',
			'c:C:2',
		]);
	});
});

describe('transform_object', () => {
	test('object', () => {
		expect(transform_object(h_test, (si_key, s_value, i_index) => ({
			[`${si_key}:${i_index}`]: `${s_value}!`,
		}))).toEqual({
			'a:0': 'A!',
			'b:1': 'B!',
			'c:2': 'C!',
		});
	});

	test('add to existing object', () => {
		expect(transform_object(h_test, (si_key, s_value, i_index) => ({
			[`${si_key}:${i_index}`]: `${s_value}!`,
		}), {_:'_'})).toEqual({
			'_': '_',
			'a:0': 'A!',
			'b:1': 'B!',
			'c:2': 'C!',
		});
	});
});

describe('transform_values', () => {
	test('object', () => {
		expect(transform_values(h_test, (s_value, si_key, i_index) => `${s_value}:${i_index}`)).toEqual({
			a: 'A:0',
			b: 'B:1',
			c: 'C:2',
		});
	});
});

describe('fold', () => {
	test('array', () => {
		const h_folded = fold(a_test, (s_value, i_index) => ({
			[s_value]: i_index,
			['_'+s_value]: i_index+'',
		}));

		expect(h_folded).toEqual({
			A: 0,
			B: 1,
			C: 2,
			_A: '0',
			_B: '1',
			_C: '2',
		});
	});
});

describe('collapse', () => {
	test('array', () => {
		expect(collapse(a_test, (s_value, i_index) => [s_value, i_index])).toEqual({
			A: 0,
			B: 1,
			C: 2,
		});
	});
});

describe('interjoin', () => {
	const a_samples = ['a', 'b', 'c'];

	test('len=0', () => {
		expect(interjoin([], 'never')).toEqual([]);
	});

	test('len=1', () => {
		expect(interjoin(a_samples.slice(0, 1), 'never')).toEqual(['a']);
	});

	test('len=2', () => {
		expect(interjoin(a_samples.slice(0, 2), '1')).toEqual(['a', '1', 'b']);
	});

	test('len=3', () => {
		expect(interjoin(a_samples, '1')).toEqual(['a', '1', 'b', '1', 'c']);
	});
});

describe('deduplicate', () => {
	test('simple array', () => {
		expect(deduplicate(['a', 'a', 'b'])).toEqual(['a', 'b']);
	});

	test('object by key', () => {
		expect(deduplicate([
			{key:'a'},
			{key:'a'},
			{key:'b'},
		], 'key')).toEqual([{key:'a'}, {key:'b'}]);
	});

	test('object by function', () => {
		expect(deduplicate([
			{key:'a', a:'A'},
			{key:'a', a:'B'},
			{key:'b', b:'B'},
		], g => g.key)).toEqual([{key:'a', a:'A'}, {key:'b', b:'B'}]);
	});
});

describe('shuffle', () => {
	test('simple array', () => {
		expect(shuffle(a_test.slice()).sort()).toEqual(a_test);
	});
});

describe('remove', () => {
	test('simple array', () => {
		expect(remove(['a', 'b', 'a'], 'a')).toEqual(['b', 'a']);
	});
});

describe('die', () => {
	test('reason', () => {
		expect(() => die('reason')).toThrow(Error);
		expect(() => die('reason')).toThrow('reason');
	});

	test('reason + data', () => {
		expect(() => die('reason', 'data')).toThrow();

		try {
			die('reason', 'data');
		}
		catch(e_throw) {
			if(is_error<{data: string}>(e_throw)) {
				expect(e_throw.data).toBe('data');
			}
			else {
				throw Error(`Expected thrown value to be an Error`);
			}
		}
	});
});

describe('try_sync', () => {
	test('returns', () => {
		const [z_value, w_error] = try_sync(() => 'value');
		expect(z_value).toBe('value');
		expect(w_error).toBe(0);
	});

	test('error', () => {
		const [z_value, w_error] = try_sync(() => die('reason'));
		expect(z_value).toBe(void 0);
		expect(w_error).toBeInstanceOf(Error);
	});
});

describe('try_async', () => {
	test('returns', async() => {
		const [z_value, w_error] = await try_async(async() => {
			await Promise.resolve();
			return 'value';
		});
		expect(z_value).toBe('value');
		expect(w_error).toBe(0);
	});

	test('error', async() => {
		const [z_value, w_error] = await try_async(async() => Promise.reject(Error('reason')));
		expect(z_value).toBe(void 0);
		expect(w_error).toBeInstanceOf(Error);
	});
});
