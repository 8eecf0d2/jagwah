/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

//@ts-ignore
import { named as pattern } from 'named-regexp';

import { handleStateEvent } from './state-event-handler';

export class Router {
	public context: Router.Context;
	public paths: Router.Path.set = {};

	constructor(
	) {
		document.addEventListener('click', handleStateEvent, true);
		window.addEventListener('popstate', () => this.handleEvent(), false);
		window.addEventListener('pushstate', () => this.handleEvent(), false);
	}

	public start() {
		this.handleEvent();
	}

	public register(pathStr: string, pathHandler: Router.Path.handler) {
		this.paths[pathStr] = {
			pattern: pattern(pathStr),
			handler: pathHandler,
		};
	}

	public navigate(path: string): { navigate: boolean } {
		if(path === location.pathname) {
			this.handleEvent();
		} else {
			const html = document.documentElement;
			const anchor = document.createElement('a');
			anchor.href = path;
			/** important that this uses "function()" syntax to correctly scope "this" */
			anchor.onclick = function() { this.parentNode.removeChild(this) };
			html.insertBefore(anchor, html.firstChild);
			anchor.click();
		}

		return {
			navigate: true
		}
	}

	private async handleEvent() {
		for(const pathStr in this.paths) {
			const path = this.paths[pathStr];
			//@ts-ignore
			const match = path.pattern.exec(location.pathname);
			if(match) {
				this.context = this.parseContext(location.pathname, match.captures)
				return path.handler(this.context);
			}
		}
	}

	private parseContext(path: string, captures: { [name: string]: string[] }): Router.Context {
		const context: Router.Context = {
			path: path,
			params: {}
		}
		for(const group in captures) {
			context.params[group] = captures[group][0];
		}
		return context
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
		pattern: NamedRegExp;
		handler: Router.Path.handler;
	}

	export interface Context {
		path: string;
		params: {
			[name: string]: string;
		}
	}
}


export module NamedRegExp {
	export type exec = (str: string) => NamedRegExp.exec.result;
	export module exec {
		export interface result extends RegExpExecArray {
			captures: {
				[name: string]: string[];
			};
		}
	}
}

export interface NamedRegExp extends RegExp {
	exec: NamedRegExp.exec;
}
