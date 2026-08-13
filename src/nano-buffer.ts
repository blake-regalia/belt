/* eslint-disable prefer-const */
import {bytes, concat} from './data.js';

export interface NanoBuffer {
	/**
	 * Appends data to the buffer
	 * @param atu8_chunk - chunk of data to append
	 */
	a(atu8_chunk: Uint8Array): void;

	/**
	 * Outputs the concatenation of all segments
	 * @returns a single {@link Uint8Array}
	 */
	o(): Uint8Array;
}

/**
 * An extremely small, fast, and efficient append-only buffer suitable for use in any environment
 * @param _nb_buffer - size of each buffer segment
 * @returns a new {@link NanoBuffer}
 */
/* eslint-disable @typescript-eslint/naming-convention */
export const NanoBuffer = (_nb_buffer=32*1024): NanoBuffer => {
	// current working buffer
	let _atu8_buffer = bytes(_nb_buffer);

	// segments containing all buffers in series
	let _a_segments: Uint8Array[] = [_atu8_buffer];

	// write position within current buffer
	let _ib_write = 0;

	// total cumulative size of bytes written
	let _nb_size = 0;
	/* eslint-enable @typescript-eslint/naming-convention */

	// instance
	return {
		// append
		a(atu8_chunk: Uint8Array) {
			// size of chunk
			let nb_chunk = atu8_chunk.length;

			// remaining capacity of current buffer
			let nb_capacity = _nb_buffer - _ib_write;

			// position to read from in chunk
			let ib_read = 0;

			// while bytes remain to be read from the chunk
			for(;ib_read<nb_chunk;) {
				// extract part of chunk to write
				let atu8_write = atu8_chunk.subarray(ib_read, ib_read+nb_capacity);

				// cache number of bytes written
				let nb_written = atu8_write.length;

				// copy bytes into place
				_atu8_buffer.set(atu8_write, _ib_write);

				// update bytes read from chunk
				ib_read += nb_written;

				// update write position
				_ib_write += nb_written;

				// no capacity left
				if(nb_written >= nb_capacity) {
					// create new buffer, setting capacity to buffer size, and add it to segments
					_a_segments.push(_atu8_buffer=bytes(nb_capacity=_nb_buffer));

					// reset write position
					_ib_write = 0;
				}
			}

			// save new size
			_nb_size += nb_chunk;
		},

		// output
		o: () => concat(_a_segments).subarray(0, _nb_size),
	};
};
