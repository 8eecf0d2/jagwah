/*
 * 8eecf0d2/hyperbole - 2018
 */

import { Hyperbole, Route, Filters, Helpers } from 'hyperbole';
import { LandingTemplate, GettingStartedTemplate } from '../templates';

@Route('/')
export class LandingRoute {
	static $templates = [LandingTemplate]
	constructor(){}
}

@Route('/getting-started')
export class GettingStartedRoute {
	static $templates = [GettingStartedTemplate]
	constructor(){}
}
