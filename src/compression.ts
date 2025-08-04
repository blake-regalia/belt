import {die} from './belt.js';
import {bytes} from './data.js';

export const bytes_to_stream = (atu8: Uint8Array<ArrayBuffer>): ReadableStream<Uint8Array<ArrayBuffer>> => new Response(atu8).body!;
export const pipe_bytes_through = (atu8: Uint8Array<ArrayBuffer>, d_pair: ReadableWritablePair<Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>>): ReadableStream<Uint8Array<ArrayBuffer>> => bytes_to_stream(atu8).pipeThrough(d_pair);
export const stream_to_bytes = async(d_stream: ReadableStream): Promise<Uint8Array<ArrayBuffer>> => bytes(await new Response(d_stream).arrayBuffer());

const transcompress_bytes_gzip = (atu8: Uint8Array<ArrayBuffer>, d_stream: typeof CompressionStream | typeof DecompressionStream) => stream_to_bytes(pipe_bytes_through(atu8, new d_stream('gzip')));

type Gzipper = (atu8: Uint8Array) => Promise<Uint8Array<ArrayBuffer>>;

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Bun: {
	gzipSync?: Gzipper;
	gunzipSync?: Gzipper;
};

export const [gzip_bytes, gunzip_bytes] = (typeof CompressionStream > 't'
	? typeof Bun > 't'
		? die('gzip (de)compression not available in current environment')
		: [
			Bun.gzipSync,
			Bun.gunzipSync,
		]
	: [
		(atu8: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> => transcompress_bytes_gzip(atu8, CompressionStream),
		(atu8: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> => transcompress_bytes_gzip(atu8, DecompressionStream),
	]) as [Gzipper, Gzipper];
