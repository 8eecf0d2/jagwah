/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Inject } from 'jagwah';

import * as routes from './routes';
import * as templates from './templates';

export class BeforeStart {
	constructor() {}
	async task() {}
}

const jagwah = new Jagwah({
	routes: Object.values(routes),
	templates: Object.values(templates),
});

jagwah.start({
	before: [BeforeStart],
	after: []
});
