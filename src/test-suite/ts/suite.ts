/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export class TestSuite {
	private tests: TestSuite.Test[] = [];

	constructor (
		public name: string
	) {}

	public test(name: string, handler: TestSuite.Test.handler) {
		this.tests.push({
			name: name,
			handler: handler,
		});
	}

	public run() {
		console.log(`\x1b[33m Suite:\x1b[0m ${this.name}\x1b[0m`);
		for(const test of this.tests) {
			try {
				test.handler();
				console.log(` - \x1b[32mPass:\x1b[0m ${test.name}\x1b[0m`);
			} catch(error) {
				console.log(` - \x1b[31mFail:\x1b[0m ${test.name}\x1b[0m`);
				throw error;
			}
		}
	}
}

export module TestSuite {
	export module Test {
		export type name = string;
		export type handler = () => void;
	}
	export interface Test {
		name: TestSuite.Test.name;
		handler: TestSuite.Test.handler;
	}
}
