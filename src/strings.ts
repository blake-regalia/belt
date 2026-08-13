import type {Subtype} from './types.js';

/**
 * An integer string
 */
export type IntStr = `${bigint}`;

/**
 * Base58 string
 */
export type NaiveBase58 = Subtype<string, 'base58'>;

/**
 * Base64 string
 */
export type NaiveBase64 = Subtype<string, 'base64'>;

/**
 * Base93 string
 */
export type NaiveBase93 = Subtype<string, 'base93'>;

/**
 * Base222 string
 */
export type NaiveBase222 = Subtype<string, 'base222'>;


interface HexMethods {
	toLowerCase(): NaiveHexLower;
	toUpperCase(): NaiveHexUpper;
}

interface HexLowerMethods extends HexMethods {
	concat(...a_lowers: readonly NaiveHexLower[]): NaiveHexLower;
	concat(...a_uppers: (NaiveHexUpper | NaiveHexMixed)[]): NaiveHexMixed;
}

interface HexUpperMethods extends HexMethods {
	concat(...a_uppers: readonly NaiveHexUpper[]): NaiveHexUpper;
	concat(...a_lowers: (NaiveHexLower | NaiveHexMixed)[]): NaiveHexMixed;
}

/**
 * Hexadecimal-encoded bytes in lowercase
 */
export type NaiveHexLower<s_subtype extends string=string> = Subtype<HexLowerMethods & s_subtype, 'hex-lower'>;

/**
 * Hexadecimal-encoded bytes in uppercase
 */
export type NaiveHexUpper<s_subtype extends string=string> = Subtype<HexUpperMethods & s_subtype, 'hex-upper'>;

/**
 * Hexadecimal-encoded bytes in mixed case
 */
export type NaiveHexMixed<s_subtype extends string=string> = Subtype<HexMethods & s_subtype, 'hex-lower' | 'hex-upper'>;

/**
 * Creates a proper-case string, returning `undefined` if given `undefined
 * @param s_input - any text to transform
 * @returns the transformed text in "Proper case"
 */
export const proper = <
	s_input extends string | undefined,
	z_output=s_input extends undefined? undefined: string,
>(s_input: s_input): NoInfer<z_output> => s_input?.split(/[\s_]+/g).map(s => s ? s[0].toUpperCase() + s.slice(1) : '').join(' ') as z_output;

/**
 * Converts given identifier to "snake_case", returning {@link s_ident} if given a falsy value
 * @param s_ident - an identifier to transform
 * @returns the transformed identifier in "snake_case"
 */
export const snake = <
	s_input extends string | undefined,
	z_output=s_input extends undefined? undefined: string,
>(s_ident: s_input): NoInfer<z_output> => (s_ident
	? s_ident.toUpperCase() === s_ident
		// depending on upper or mixed case
		? s_ident.toLowerCase().replace(/[^a-z0-9$]+/g, '_')
		: s_ident.replace(/(?<!^)(?:[^a-zA-Z0-9$]*([A-Z])|[^a-zA-Z0-9$]+)/g, (s_ignore, s_cap) => '_' + (s_cap || '')).toLowerCase()
	: s_ident) as z_output;

/**
 * Converts given identifier to "PascalCase", returning {@link s_ident} if given a falsy value
 * @param s_ident - an identifier to transform
 * @returns the transformed identifier in "PascalCase"
 */
export const pascal = <
	s_input extends string | undefined,
	z_output=s_input extends undefined? undefined: string,
>(s_ident: s_input): NoInfer<z_output> => (s_ident
	// if all uppercase; make lower
	? (/^([^A-Za-z]*[A-Z]+)+([^A-Za-z])?$/.test(s_ident) ? pascal(s_ident.toLowerCase()) : s_ident)
		// convert to pascal
		.replace(/(?:^|[^A-Za-z0-9$])([\w0-9$]|$)/g, (s_ignore, s_letter) => s_letter.toUpperCase()).trim()
	: s_ident) as z_output;

/**
 * Escape all special regex characters to turn a string into a verbatim match pattern
 * @param s_input input string
 * @returns escaped string ready for RegExp constructor
 */
export const escape_regex = (s_input: string): string => s_input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
