import {expect, describe, test} from 'bun:test';

import {timeout} from '../dist/mjs/async';
import {Debouncer} from '../dist/mjs/debouncer';

describe('debouncer', () => {
	test('void', async() => {
		let c_runs = 0;

		const y_debouncer = Debouncer(() => {
			c_runs += 1;
		}, 1e3, Infinity, 5e3, 3);

		y_debouncer.hit();
		y_debouncer.hit();

		expect(c_runs).toBe(0);

		await timeout(1e3);

		expect(c_runs).toBe(1);

		y_debouncer.hit();

		expect(await y_debouncer.clears()).toBe(2);
	});
});
