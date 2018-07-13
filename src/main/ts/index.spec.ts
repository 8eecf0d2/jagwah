/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

/** todo: use an actual test suite & run in a browser */
import { TestSuite } from '../../test-suite/ts/suite';
import * as assert from 'should';

const testSuite = new TestSuite('Jagwah');

testSuite.test('Stub', async () => {
	assert(true).equal(true);
});

testSuite.run();
