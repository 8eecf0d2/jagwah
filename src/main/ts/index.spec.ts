/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import * as assert from 'should';
import { TestSuite } from '../../test-suite/ts/suite';

const testSuite = new TestSuite('Jagwah');

testSuite.test('Stub', () => {
	assert(true).equal(true);
});

testSuite.run();
