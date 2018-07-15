/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

/** todo: use an actual test suite & run in a browser */
import { TestSuite } from '../../test-suite/ts/suite';
import * as assert from 'should';
import { Jagwah, Provider, Selector, Route } from './';

const testSuite = new TestSuite('Jagwah');

testSuite.test('Provider Registration', async () => {
	@Provider('$test')
	class TestProvider {}

	const jagwah = new Jagwah();
	jagwah.Provider(TestProvider);

	//@ts-ignore
	assert(jagwah.providers).keys(['$test']);
});

testSuite.test('Template Registration', async () => {
	@Selector('#test')
	class TestTemplate {
		public render(render: Jagwah.Template.render) {
			return render``
		}
	}

	const jagwah = new Jagwah();
	jagwah.Template(TestTemplate);

	//@ts-ignore
	assert(jagwah.templates).keys(['#test'])
});

testSuite.test('Route Registration', async () => {
	@Route('/test')
	class TestRoute {}

	const jagwah = new Jagwah();
	jagwah.Route(TestRoute);

	//@ts-ignore
	assert(jagwah.router.paths).keys(['/test'])
});

testSuite.run();
