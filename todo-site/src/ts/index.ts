/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Inject } from 'jagwah';

import * as providers from './providers';
import * as templates from './templates';

const jagwah = new Jagwah({
	providers: Object.values(providers),
	templates: Object.values(templates),
});

jagwah.update();
