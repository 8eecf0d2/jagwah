/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

//@ts-ignore
import * as hyperApp from 'hyperhtml-app';
import * as hyperhtml from 'hyperhtml/cjs';

import { Radio } from './radio';
import { Router } from './router';
import { Providers } from './providers';

export * from './helpers';
export * from './decorators';

export class Hyperbole {
	public initialized: boolean = false;
	// public router: Router = new Router();
	public router: Hyperbole.router = hyperApp();
	public radio: Radio = new Radio();

	public constants: { [key: string]: any };

	/** all providers */
	private providers: Hyperbole.Provider.set = {};
	/** all templates */
	private templates: Hyperbole.Template.set = {};

	constructor(
		options: Hyperbole.options = {},
	) {
		this.constants = options.constants;

		/** initialize "this" as provider $hyperbole */
		this.providers['$hyperbole'] = this;

		/** initialize providers */
		if(options.providers) {
			const providers = [ Providers.SyncProvider, Providers.HttpProvider, ...options.providers ]
			for(const provider in providers) {
				this.Provider(providers[provider]);
			}
		}

		/** initialize routes */
		if(options.routes) {
			for(const route in options.routes) {
				this.Route(options.routes[route]);
			}
		}

		/** initialize templates */
		if(options.templates) {
			for(const template in options.templates) {
				this.Template(options.templates[template]);
			}
		}
	}

	/** start the hyperbole application */
	public async start(options: Hyperbole.start.options = {}) {
		if(options.before) {
			await Promise.all(options.before.map(BeforeHandler => {
				const dependencies = this.Dependencies(BeforeHandler.$inject);
				return new BeforeHandler(...dependencies).task();
			}))
		}

		this.initialized = true;
		this.router.navigate(window.location.pathname);

		if(options.after) {
			await Promise.all(options.after.map(AfterHandler => {
				const dependencies = this.Dependencies(AfterHandler.$inject);
				return new AfterHandler(...dependencies).task();
			}))
		}
	}

	/**
	 * Initialize a Template for rendering.
	 */
	public Template(template: Hyperbole.Template) {
		const dependencies = this.Dependencies(template.$inject);
		const _template: Hyperbole.Template.copy = {
			$selector: template.$selector,
			$template: template.$template,
			$element: hyperhtml.bind(document.querySelectorAll(template.$selector)[0]),
			instance: new template(...dependencies),
		}

		/** add / replace template in active templates (based on selector) */
		this.templates[_template.$selector] = _template;
	}

	/**
	 * Initialize a Provider for state management.
	 */
	public Provider(provider: Hyperbole.Provider) {
		const dependencies = this.Dependencies(provider.$inject);
		this.providers[provider.$provider] = new provider(...dependencies);
	}

	/**
	 * Add a route with templates / callbacks
	 */
	public Route(route: Hyperbole.Route) {
		const dependencies = this.Dependencies(route.$inject);
		const _route = new route(...dependencies);
		this.router.get(route.$route, async (ctx: any) => {
			this.router.params = ctx.params;
			/** run route $before middleware */
			if(route.$before) {
				for(const middleware of route.$before) {
					await this.Middleware(middleware);
				}
			}

			/** run route before() method */
			if(_route.before) {
				await _route.before(ctx)
			}

			/** set route templates */
			if(route.$templates) {
				for(const template of route.$templates) {
					this.Template(template);
				}
			}

			/** update templates in use */
			this.update();

			/** run route after() method */
			if(_route.after) {
				await _route.after(ctx)
			}

			/** run route $after middleware */
			if(route.$after) {
				for(const middleware of route.$after) {
					await this.Middleware(middleware);
				}
			}
		});
	}

	/**
	 * Handle middleware for route
	 */
	public async Middleware(middleware: Hyperbole.Middleware.instance) {
		const middlewareDependencies = this.Dependencies(middleware.$inject);
		return middleware.task(...middlewareDependencies);
	}

	/**
	 * Get dependencies from array of dependency names.
	 */
	private Dependencies(names: Hyperbole.Provider.name[] = []): Hyperbole.Provider.instance[] {
		const dependencies = [];
		for(const injectName of names) {
			if(this.providers[injectName]) {
				dependencies.push(this.providers[injectName]);
			}
		}
		return dependencies;
	}

	/**
	 * Update DOM
	 */
	public update() {
		for(const template in this.templates) {
			this.templates[template].instance.render(this.templates[template].$element);
		}
	}
}

export module Hyperbole {
	/** hyperHtml */
	export const wire = hyperhtml.wire;
	export const bind = hyperhtml.bind;
	export const define = hyperhtml.define;

	/** hyperHtml-app */
	/** todo: rewrite... */
	export interface router {
		navigate: (path: string, options?: { replace: boolean }) => void;
		get: (path: string, callback: (ctx: any) => void) => void;
		params: { [key: string]: string };
	}

	export interface options {
		constants?: { [key: string]: any };
		providers?: Hyperbole.Provider[];
		routes?: Hyperbole.Route[];
		templates?: Hyperbole.Template[];
	}

	export module start {
		export interface options {
			before?: any[];
			after?: any[];
		}
	}

	/** Provider */
	export module Provider {
		export type name = string;
		export interface set {
			[ProviderName: string]: Hyperbole.Provider.instance;
		}
		export interface instance {}

		/** Built-in Providers*/
		export type SyncProvider = Providers.SyncProvider;
		export type HttpProvider = Providers.HttpProvider;
	}
	export interface Provider {
		new(...dependencies: Hyperbole.Provider.instance[]): Hyperbole.Provider.instance;
		$provider?: Hyperbole.Provider.name;
		$inject?: Hyperbole.Provider.name[];
	}

	/** Template */
	export module Template {
		export type name = string;
		export type selector = string;
		export type element = hyperhtml.BoundTemplateFunction<Element>;
		export type render = hyperhtml.WiredTemplateFunction;
		export interface set {
			[TemplateName: string]: Hyperbole.Template.copy;
		}
		export interface copy {
			$selector: string;
			$template: string;
			$element: Hyperbole.Template.element;
			instance: any;
		}
		export interface instance {
			render: (render: Hyperbole.Template.render) => HTMLElement|Promise<HTMLElement>;
		}
	}
	export interface Template {
		new(...dependencies: Hyperbole.Provider.instance[]): Hyperbole.Template.instance;
		$template?: Hyperbole.Template.name;
		$selector?: Hyperbole.Template.selector;
		$inject?: Hyperbole.Provider.name[];
	}

	/** Route */
	export module Route {
		export type path = string;
		export type middleware = hyperhtml.WiredTemplateFunction;
		export interface instance {
			before?: (ctx: any) => void;
			after?: (ctx: any) => void;
		}
	}
	export interface Route {
		new(...dependencies: Hyperbole.Provider.instance[]): Hyperbole.Route.instance;
		$route?: Hyperbole.Route.path;
		$templates?: Hyperbole.Template[];
		$inject?: Hyperbole.Provider.name[];
		$before?: Hyperbole.Middleware.instance[];
		$after?: Hyperbole.Middleware.instance[];
	}

	/** Middleware */
	export module Middleware {
		export interface instance {
			task: (...dependencies: Hyperbole.Provider.instance[]) => void;
			/** todo: not sure how this is supposed to work lol */
			$inject?: Hyperbole.Provider.name[];
		}
	}
	export interface Middleware {
		new(...params: any[]): Hyperbole.Route.instance;
		/** todo: not sure how this is supposed to work lol */
		$inject?: Hyperbole.Provider.name[];
	}

	export const ObjectToArray = <T = any>(obj: {[key: string]: T}): T[] => {
		const array = [];
		for(const key in obj) {
			array.push(obj[key]);
		}
		return array;
	}
}
