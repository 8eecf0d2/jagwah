/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import * as urlPattern from 'url-pattern';
/** todo: remove this dependency _or_ repackage as something that doesn't use yucky side effects */
import 'onpushstate';

import { Radio } from './radio';

export class Router {
	public context: Router.Context;
	public paths: Router.Path.set = {};

	constructor(
		public radio: Radio,
	) {
    window.addEventListener('popstate', () => this.handleEvent(), false);
    window.addEventListener('pushstate', () => this.handleEvent(), false);
	}

	public register(pathStr: string, pathHandler: Router.Path.handler) {
		this.paths[pathStr] = {
			pattern: new urlPattern(pathStr),
			handler: pathHandler,
		};
	}

	public navigate(path: string) {
		if(path === location.pathname) {
			return this.handleEvent();
		}
    const html = document.documentElement;
    const anchor = document.createElement('a');
    anchor.href = path;
    /** important that this uses "function()" syntax to correctly scope "this" */
    anchor.onclick = function() { this.parentNode.removeChild(this) };
    html.insertBefore(anchor, html.firstChild);
    anchor.click();
	}

	private async handleEvent() {
		for(const pathStr in this.paths) {
			const path = this.paths[pathStr];
			const match = path.pattern.match(location.pathname);
			if(match) {
				this.context = {
					path: location.pathname,
					params: match,
				}
				await path.handler(this.context);
				return this.radio.emit(`router:update`, this.context);
			}
		}
	}

}

export module Router {
	export module Path {
		export type handler = (context: Router.Context) => void;
		export interface set {
			[Pattern: string]: Router.Path;
		}
	}
	export interface Path {
		pattern: urlPattern;
		handler: Router.Path.handler;
	}

	export interface Context {
		path: string;
		params: {
			[name: string]: string;
		}
	}
}