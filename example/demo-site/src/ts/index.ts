/*
 * 8eecf0d2/hyperbole - 2018
 */

import { Hyperbole, Inject } from 'hyperbole';

import * as routes from './routes';
import * as templates from './templates';

export class BeforeStart {
	constructor() {}
	async task() {}
}

const hyperapp = new Hyperbole();

hyperapp.start({
	routes: routes,
	templates: templates,
	before: [BeforeStart],
	after: []
});
