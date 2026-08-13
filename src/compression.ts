import {die} from './belt.js';
import {bytes} from './data.js';

export const bytes_to_stream = (atu8: Uint8Array<ArrayBuffer>): ReadableStream<Uint8Array<ArrayBuffer>> => new Response(atu8).body!;
export const pipe_bytes_through = (atu8: Uint8Array<ArrayBuffer>, d_pair: ReadableWritablePair<Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>): ReadableStream<Uint8Array<ArrayBuffer>> => bytes_to_stream(atu8).pipeThrough(d_pair);
export const stream_to_bytes = async(d_stream: ReadableStream): Promise<Uint8Array<ArrayBuffer>> => bytes(await new Response(d_stream).arrayBuffer());

const transcompress_bytes_gzip = (atu8: Uint8Array<ArrayBuffer>, d_stream: typeof CompressionStream | typeof DecompressionStream) => stream_to_bytes(pipe_bytes_through(atu8, new d_stream('gzip')));

type Gzipper = (atu8: Uint8Array) => Promise<Uint8Array<ArrayBuffer>>;
type BunGzipper = (atu8: Uint8Array) => Uint8Array | Promise<Uint8Array>;

type BunCompression = {
	gzipSync?: BunGzipper;
	gunzipSync?: BunGzipper;
};

const transcompress_bytes = async(atu8: Uint8Array, b_decompress: boolean): Promise<Uint8Array<ArrayBuffer>> => {
	const d_stream = b_decompress? globalThis.DecompressionStream: globalThis.CompressionStream;
	if(d_stream) return transcompress_bytes_gzip(atu8 as Uint8Array<ArrayBuffer>, d_stream);

	const d_bun = (globalThis as typeof globalThis & {Bun?: BunCompression}).Bun;
	const f_bun = b_decompress? d_bun?.gunzipSync: d_bun?.gzipSync;
	if(f_bun) return bytes(await f_bun(atu8));

	return die('gzip (de)compression not available in current environment');
};

export const gzip_bytes: Gzipper = atu8 => transcompress_bytes(atu8, false);
export const gunzip_bytes: Gzipper = atu8 => transcompress_bytes(atu8, true);
