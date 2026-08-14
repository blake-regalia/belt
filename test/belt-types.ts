/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {each, keys, values, entries, map_entries, reduce_object, fold} from 'src/belt';

// each
{
	// empty array
	each([], () => void 0);

	// array of strings
	each([''], (s_each, i_each) => {
		const B_STRING: string extends typeof s_each? 1: 0 = 1;
		const B_INDEX: number extends typeof i_each? 1: 0 = 1;
	});

	// set of strings
	each(new Set<string>(), (s_each, i_each) => {
		const B_STRING: string extends typeof s_each? 1: 0 = 1;
		const B_INDEX: number extends typeof i_each? 1: 0 = 1;
	});

	// set of strong literals
	each(new Set<`${bigint}`>(), (s_each, i_each) => {
		const B_STRING: `${bigint}` extends typeof s_each? 1: 0 = 1;
		const B_INDEX: number extends typeof i_each? 1: 0 = 1;
	});
}

// keys
{
	const a_dict_never = keys({});
	const B_DICT_NEVER: never[] extends typeof a_dict_never? 1: 0 = 1;

	const a_dict_weak = keys({a:'A', b:'B'});
	const B_DICT_WEAK: ('a' | 'b')[] extends typeof a_dict_weak? 1: 0 = 1;

	const a_dict_strong = keys({a:'A', b:'B'} as const);
	const B_DICT_STRONG: ('a' | 'b')[] extends typeof a_dict_strong? 1: 0 = 1;

	const a_dict_override = keys<Record<'a' | 'b', 'A' | 'B' | 'C'>>({a:'A', b:'B'});
	const B_DICT_OVERRIDE: ('a' | 'b')[] extends typeof a_dict_override? 1: 0 = 1;

	const a_array_never = keys([]);
	const B_ARRAY_NEVER: `${bigint}`[] extends typeof a_array_never? 1: 0 = 1;

	const a_array_strings = keys(['a', 'b']);
	const B_ARRAY_STRINGS: `${bigint}`[] extends typeof a_array_strings? 1: 0 = 1;
}

// values
{
	const a_dict_never = values({});
	const B_DICT_NEVER: never[] extends typeof a_dict_never? 1: 0 = 1;

	const a_dict_weak = values({a:'A', b:'B'});
	const B_DICT_WEAK: string[] extends typeof a_dict_weak? 1: 0 = 1;

	const a_dict_strong = values({a:'A', b:'B'} as const);
	const B_DICT_STRONG: ('A' | 'B')[] extends typeof a_dict_strong? 1: 0 = 1;

	const a_dict_override = values<Record<'a' | 'b', 'A' | 'B' | 'C'>>({a:'A', b:'B'});
	const B_DICT_OVERRIDE: ('A' | 'B' | 'C')[] extends typeof a_dict_override? 1: 0 = 1;

	const a_array_never = values([]);
	const B_ARRAY_NEVER: never[] extends typeof a_array_never? 1: 0 = 1;

	const a_array_strings = values(['a', 'b']);
	const B_ARRAY_STRINGS: string[] extends typeof a_array_strings? 1: 0 = 1;
}

// entries
{
	const a_dict_never = entries({});
	const B_DICT_NEVER: [never, never][] extends typeof a_dict_never? 1: 0 = 1;

	const a_dict_weak = entries({a:'A', b:'B'});
	const B_DICT_WEAK: ['a' | 'b', string][] extends typeof a_dict_weak? 1: 0 = 1;

	const a_dict_strong = entries({a:'A', b:'B'} as const);
	const B_DICT_STRONG: ['a' | 'b', 'A' | 'B'][] extends typeof a_dict_strong? 1: 0 = 1;

	const a_dict_override = entries<Record<'a' | 'b', 'A' | 'B' | 'C'>>({a:'A', b:'B'});
	const B_DICT_OVERRIDE: ['a' | 'b', 'A' | 'B' | 'C'][] extends typeof a_dict_override? 1: 0 = 1;

	const a_array_never = entries([]);
	const B_ARRAY_NEVER: [`${bigint}`, never][] extends typeof a_array_never? 1: 0 = 1;

	const a_array_strings = entries(['a', 'b']);
	const B_ARRAY_STRINGS: [`${bigint}`, string][] extends typeof a_array_strings? 1: 0 = 1;
}

// map_entries
{
	const a_dict_string_weak = map_entries({a:'A', b:'B'}, ([si_keys, s_values]) => {
		const B_KEYS: 'a' | 'b' extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: string extends typeof s_values? 1: 0 = 1;

		return '';
	});
	const B_DICT_STRING_WEAK: string[] extends typeof a_dict_string_weak? 1: 0 = 1;

	const a_dict_string_strong = map_entries({a:'A', b:'B'} as const, ([si_keys, s_values]) => {
		const B_KEYS: 'a' | 'b' extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: 'A' | 'B' extends typeof s_values? 1: 0 = 1;

		return '1' as const;
	});
	const B_DIT_STRING_STRONG: '1'[] extends typeof a_dict_string_strong? 1: 0 = 1;

	const a_array_never = map_entries([], ([si_keys, s_values]) => {
		const B_KEYS: `${bigint}` extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: typeof s_values extends never? 1: 0 = 1;

		return void 0;
	});
	const B_ARRAY_NEVER: undefined[] extends typeof a_array_never? 1: 0 = 1;

	const a_array_numbers = map_entries([1, 2, 3], ([si_keys, s_values]) => {
		const B_KEYS: `${bigint}` extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: number extends typeof s_values? 1: 0 = 1;

		return 1;
	});
	const B_ARRAY_NUMBERS: number[] extends typeof a_array_numbers? 1: 0 = 1;
}

// reduce_object
{
	const a_dict_string_weak = reduce_object({a:'A', b:'B'}, (s_acc, [si_keys, s_values]) => {
		const B_ACC: string extends typeof s_acc? 1: 0 = 1;
		const B_KEYS: 'a' | 'b' extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: string extends typeof s_values? 1: 0 = 1;

		return '';
	}, '');
	const B_DICT_STRING_WEAK: string extends typeof a_dict_string_weak? 1: 0 = 1;

	const a_dict_string_strong = reduce_object({a:'A', b:'B'} as const, (s_acc, [si_keys, s_values]) => {
		const B_ACC: '1' extends typeof s_acc? 1: 0 = 1;
		const B_KEYS: 'a' | 'b' extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: 'A' | 'B' extends typeof s_values? 1: 0 = 1;

		return s_acc;
	}, '1' as const);
	const B_DIT_STRING_STRONG: '1' extends typeof a_dict_string_strong? 1: 0 = 1;

	const a_array_never = reduce_object([], (z_acc, [si_keys, s_values]) => {
		const B_ACC: undefined extends typeof z_acc? 1: 0 = 1;
		const B_KEYS: `${bigint}` extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: typeof s_values extends never? 1: 0 = 1;

		return void 0;
	}, void 0);
	const B_ARRAY_NEVER: undefined extends typeof a_array_never? 1: 0 = 1;

	const a_array_numbers = reduce_object([1, 2, 3], (n_acc, [si_keys, s_values]) => {
		const B_ACC: number extends typeof n_acc? 1: 0 = 1;
		const B_KEYS: `${bigint}` extends typeof si_keys? 1: 0 = 1;
		const B_VALUES: number extends typeof s_values? 1: 0 = 1;

		return 1;
	}, 0);
	const B_ARRAY_NUMBERS: number extends typeof a_array_numbers? 1: 0 = 1;
}


// fold
{
	type PassString = `pass:${string}`;

	const a_items: PassString[] = ['pass:1', 'pass:2'];
	const h_existing = {} as Record<PassString, string>;

	type AssertPasses<h_test> = keyof h_test extends PassString? 1: 0;

	const h_from_callback_return = fold(a_items, s_value => ({[s_value]:s_value}) as Record<PassString, string>);
	const h_from_output_arg = fold(a_items, s_value => ({[s_value]:s_value}), h_existing);
	const h_from_iterable_value = fold(a_items, s_value => ({[s_value]:s_value}));
	const h_default = fold(['a', 'b'], s_value => ({[s_value]:s_value}));

	const B_FROM_CALLBACK_RETURN: AssertPasses<typeof h_from_callback_return> = 1;
	const B_FROM_OUTPUT_ARG: AssertPasses<typeof h_from_output_arg> = 1;
	const B_FROM_ITERABLE_VALUE: typeof h_from_iterable_value extends Record<string, PassString>? 1: 0 = 1;
	const B_DEFAULT: AssertPasses<typeof h_default> = 0;
}
