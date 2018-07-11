/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

/** todo: switch to url-pattern package */
import * as pathToRegex from 'path-to-regexp';
import 'onpushstate';

export class Router {
	public context: Router.Context;
	public paths: Router.Path.set = {};

	constructor() {
    window.addEventListener('popstate', () => this.handleEvent(), false);
    window.addEventListener('pushstate', () => this.handleEvent(), false);
	}

	public get(pathStr: string, pathHandler: Router.Path.handler) {
		const pathKeys: pathToRegex.Key[] = [];
		const pathRegExp = this.parsePath(pathStr, pathKeys);
		//@ts-ignore
		this.paths[pathRegExp] = {
			keys: pathKeys,
			regex: pathRegExp,
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
    anchor.onclick = function() { this.parentNode.removeChild(this) };
    html.insertBefore(anchor, html.firstChild);
    anchor.click();
	}

	private handleEvent() {
		for(const pathRegExp in this.paths) {
			const path = this.paths[pathRegExp];
			const match = path.regex.exec(location.pathname);
			if(match) {
				this.handleMatch(path, match);
			}
		}
	}

	private handleMatch(path: Router.Path, result: RegExpExecArray) {
		this.context = {
			params: this.deconstructParams(path.keys, result),
		};
		path.handler(this.context);
	}

	private deconstructParams(keys: pathToRegex.Key[], result: RegExpExecArray) {
		const params: { [key: string]: string } = {};
		for(const key in keys) {
			params[keys[key].name] = result[parseInt(key) + 1];
		}
		return params;
	}

	private parsePath(path: string, keys: pathToRegex.Key[]) {
		return pathToRegex(path, keys);
	}
}

export module Router {
	export module Path {
		export type handler = (context: Router.Context) => void;
		export interface set {
			[RegExp: string]: Router.Path;
		}
	}
	export interface Path {
		keys: pathToRegex.Key[];
		regex: RegExp;
		handler: Router.Path.handler;
	}

	export interface Context {
		params: {
			[name: string]: string;
		}
	}
}
