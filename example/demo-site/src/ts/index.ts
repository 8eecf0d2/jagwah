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
	routes: Jagwah.ObjectToArray(routes),
	templates: Jagwah.ObjectToArray(templates),
});

jagwah.start({
	before: [BeforeStart],
	after: []
});
