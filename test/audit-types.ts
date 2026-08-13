/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */

import type {EntryKeysOf, JsonValue} from 'src/types';

// create symbol key
declare const D_SYMBOL: unique symbol;

// infer enumerable entry keys
type EntryKeys = EntryKeysOf<{
	// string key
	string: 1;

	// symbol key
	[D_SYMBOL]: 2;
}>;

// verify string key is retained
const B_STRING_KEY: 'string' extends EntryKeys? 1: 0 = 1;

// verify symbol key is omitted
const B_SYMBOL_KEY: typeof D_SYMBOL extends EntryKeys? 1: 0 = 0;

// verify undefined is not JSON
const B_JSON_UNDEFINED: undefined extends JsonValue? 1: 0 = 0;

// verify undefined arrays are not JSON
const B_JSON_UNDEFINED_ARRAY: undefined[] extends JsonValue? 1: 0 = 0;

// get possibly undefined serialization result
const sx_json = JSON.stringify(void 0);

// verify undefined return is represented
const B_STRINGIFY_UNDEFINED: undefined extends typeof sx_json? 1: 0 = 1;
