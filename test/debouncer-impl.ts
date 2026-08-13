import {expect, describe, test} from 'bun:test';

import {defer, timeout} from '../dist/mjs/async';
import {Debouncer} from '../dist/mjs/debouncer';

describe('debouncer', () => {
	test('void', async() => {
		let c_runs = 0;

		const y_debouncer = Debouncer(() => {
			c_runs += 1;
		}, 20, Infinity, 100, 3);

		y_debouncer.hit();
		y_debouncer.hit();

		expect(c_runs).toBe(0);

		await timeout(30);

		expect(c_runs).toBe(1);

		y_debouncer.hit();

		expect(await y_debouncer.clears()).toBe(1);
		await y_debouncer.cancel();
	});

	test('idle execution only runs once', async() => {
		let c_runs = 0;
		const y_debouncer = Debouncer(() => {
			c_runs += 1;
		}, Infinity, Infinity, 10, 1);

		y_debouncer.hit();
		expect(await y_debouncer.clears()).toBe(1);
		await timeout(45);
		expect(c_runs).toBe(2);
	});

	test('callback rejection settles clears and resets busy state', async() => {
		const e_expected = Error('expected');
		let b_fail = true;
		const y_debouncer = Debouncer(() => {
			if(b_fail) throw e_expected;
		}, Infinity, Infinity, Infinity, 1);

		y_debouncer.hit();
		await expect(y_debouncer.clears()).rejects.toBe(e_expected);

		b_fail = false;
		y_debouncer.hit();
		expect(await y_debouncer.clears()).toBe(1);
	});

	test('cancel clears pending work and settles clears', async() => {
		let c_runs = 0;
		const y_debouncer = Debouncer(() => {
			c_runs += 1;
		}, 20);

		y_debouncer.hit();
		const dp_cleared = y_debouncer.clears();
		await y_debouncer.cancel();
		expect(await dp_cleared).toBe(1);
		await timeout(30);
		expect(c_runs).toBe(0);
	});

	test('serializes a trigger that fires while the callback is busy', async() => {
		const [dp_release, fk_release] = defer<void>();
		let c_active = 0;
		let c_max_active = 0;
		let c_runs = 0;
		const y_debouncer = Debouncer(async() => {
			c_runs += 1;
			c_active += 1;
			c_max_active = Math.max(c_max_active, c_active);
			if(1 === c_runs) await dp_release;
			c_active -= 1;
		}, Infinity, Infinity, Infinity, 1);

		y_debouncer.hit();
		const dp_first = y_debouncer.clears();
		await timeout(5);
		y_debouncer.hit();
		const dp_second = y_debouncer.clears();
		fk_release();

		expect(await dp_first).toBe(1);
		expect(await dp_second).toBe(1);
		expect(c_runs).toBe(2);
		expect(c_max_active).toBe(1);
	});
});
