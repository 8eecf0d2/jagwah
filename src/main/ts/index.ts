/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import * as hyperhtml from 'hyperhtml/cjs';

import { Router } from './router';
import { Providers } from './providers';

export * from './helpers';
export * from './decorators';

export class Jagwah {
	public router: Router = new Router();

	public constants: { [key: string]: any };

	private providers: Jagwah.Provider.set = {};
	private templates: Jagwah.Template.set = {};

	private documentTitle: string;

	constructor(options: Jagwah.options = {}) {
		this.documentTitle = options.title || "";
		this.title();
		/** register constants */
		this.constants = options.constants;

		/** register "this" as provider $jagwah */
		this.providers['$jagwah'] = this;

		/** register providers */
		const providers = [ Providers.SyncProvider, ...(options.providers || []) ]
		for(const provider in providers) {
			this.Provider(providers[provider]);
		}

		/** register routes */
		if(options.routes) {
			for(const route in options.routes) {
				this.Route(options.routes[route]);
			}
		}

		/** register templates */
		if(options.templates) {
			for(const template in options.templates) {
				this.Template(options.templates[template]);
			}
		}
	}

	/** start the Jagwah application */
	public async start(options: Jagwah.start.options = {}) {
		if(options.before) {
			await this.processStartHandler(options.before);
		}

		this.router.start();

		if(options.after) {
			await this.processStartHandler(options.after);
		}

	}

	private async processStartHandler(handlers: any[]) {
		return Promise.all(handlers.map(handler => {
			const dependencies = this.Dependencies(handler.$inject);
			return new handler(...dependencies).task();
		}));
	}

	public title(value?: string, replace: boolean = false) {
		document.title = replace && this.documentTitle ? value : value ? `${this.documentTitle} - ${value}` : this.documentTitle;
	}

	/**
	 * Initialize a Template for rendering.
	 */
	public Template(template: Jagwah.Template) {
		if(!document.querySelectorAll(template.$selector)[0]) {
			throw new Error(`Error: element "${template.$selector}"" for template "${template.$template}" could not be found.`)
		}
		const dependencies = this.Dependencies(template.$inject);
		const _template: Jagwah.Template.copy = {
			$selector: template.$selector,
			$template: template.$template || 'anonymous',
			$element: hyperhtml.bind(document.querySelectorAll(template.$selector)[0]),
			instance: new template(...dependencies),
		}

		/** add / replace template in active templates (based on selector) */
		this.templates[_template.$selector] = _template;
	}

	/**
	 * Initialize a Provider for state management.
	 */
	public Provider(provider: Jagwah.Provider) {
		const dependencies = this.Dependencies(provider.$inject);
		this.providers[provider.$provider] = new provider(...dependencies);
	}

	/**
	 * Initialize a Route for state / templates changes.
	 */
	public Route(route: Jagwah.Route) {
		const dependencies = this.Dependencies(route.$inject);
		const routeInstance = new route(...dependencies);
		this.router.register(route.$route, async (context: Router.Context) => {
			this.title();

			context.params = {
				...context.params,
				...route.$context,
			}

			/** set route "before" templates */
			if(route.$beforetemplates && context.path === this.router.context.path) {
				for(const template of route.$beforetemplates) {
					this.Template(template);
				}
				/** update templates in use */
				this.update();
			}

			/** run route $before middleware */
			if(route.$before && context.path === this.router.context.path) {
				const result = await this.Middleware(route.$before);
				if(context.path !== this.router.context.path) {
					return
				}
			}

			/** run route before() method */
			if(routeInstance.before && context.path === this.router.context.path) {
				const result = await routeInstance.before(context);
				if(context.path !== this.router.context.path) {
					return
				}
			}

			/** set route "after" templates */
			if(route.$aftertemplates && context.path === this.router.context.path) {
				for(const template of route.$aftertemplates) {
					this.Template(template);
				}
				/** update templates in use */
				this.update();
			}

			/** run route after() method */
			if(routeInstance.after && context.path === this.router.context.path) {
				const result = await routeInstance.after(context);
				if(context.path !== this.router.context.path) {
					return
				}
			}

			/** run route $after middleware */
			if(route.$after && context.path === this.router.context.path) {
				const result = await this.Middleware(route.$after);
				if(context.path !== this.router.context.path) {
					return
				}
			}

		});
	}

	/**
	 * Handle middleware for route
	 */
	private async Middleware(middlewares: Jagwah.Middleware.instance[]) {
		for(const middleware of middlewares) {
			const depdendencies = this.Dependencies(middleware.$inject);
			const result = await middleware.task(...depdendencies);
		}
	}

	/**
	 * Get dependencies from array of dependency names.
	 */
	private Dependencies(names: Jagwah.Provider.name[] = []): Jagwah.Provider.instance[] {
		const dependencies = [];
		for(const name of names) {
			if(this.providers[name]) {
				dependencies.push(this.providers[name]);
			} else {
				throw new Error(`Dependency "${name}" could not be found`)
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

export namespace Jagwah {
	/** hyperHtml */
	export const wire = hyperhtml.wire;
	export const bind = hyperhtml.bind;
	export const define = hyperhtml.define;

	export interface options {
		title?: string;
		constants?: { [key: string]: any };
		providers?: Jagwah.Provider[];
		routes?: Jagwah.Route[];
		templates?: Jagwah.Template[];
	}

	export namespace start {
		export interface options {
			before?: any[];
			after?: any[];
		}
	}

	/** Provider */
	export namespace Provider {
		export type name = string;
		export interface set {
			[ProviderName: string]: Jagwah.Provider.instance;
		}
		export interface instance {}

		/** Built-in Providers*/
		export type SyncProvider = Providers.SyncProvider;
		export type RouterProvider = Router;
	}
	export interface Provider {
		new(...dependencies: Jagwah.Provider.instance[]): Jagwah.Provider.instance;
		$provider?: Jagwah.Provider.name;
		$inject?: Jagwah.Provider.name[];
	}

	/** Template */
	export namespace Template {
		export type name = string;
		export type selector = string;
		export type element = hyperhtml.BoundTemplateFunction<Element>;
		export type render = hyperhtml.WiredTemplateFunction;
		export interface set {
			[TemplateName: string]: Jagwah.Template.copy;
		}
		export interface copy {
			$selector: string;
			$template?: string;
			$element: Jagwah.Template.element;
			instance: any;
		}
		export interface instance {
			render: (render: Jagwah.Template.render) => HTMLElement|Promise<HTMLElement>;
		}
	}
	export interface Template {
		new(...dependencies: Jagwah.Provider.instance[]): Jagwah.Template.instance;
		$template?: Jagwah.Template.name;
		$selector?: Jagwah.Template.selector;
		$inject?: Jagwah.Provider.name[];
	}

	/** Route */
	export namespace Route {
		export type path = string;
		export type middleware = hyperhtml.WiredTemplateFunction;
		export interface instance {
			before?: (context: Router.Context) => any;
			after?: (context: Router.Context) => any;
		}
	}
	export interface Route {
		new(...dependencies: Jagwah.Provider.instance[]): Jagwah.Route.instance;
		$route?: Jagwah.Route.path;
		$context?: { [key: string]: any };
		$aftertemplates?: Jagwah.Template[];
		$beforetemplates?: Jagwah.Template[];
		$inject?: Jagwah.Provider.name[];
		$before?: Jagwah.Middleware.instance[];
		$after?: Jagwah.Middleware.instance[];
	}

	/** Middleware */
	export namespace Middleware {
		export interface instance {
			task: (...dependencies: Jagwah.Provider.instance[]) => any;
			/** todo: not sure how this is supposed to work lol */
			$inject?: Jagwah.Provider.name[];
		}
	}
	export interface Middleware {
		new(...params: any[]): Jagwah.Route.instance;
		/** todo: not sure how this is supposed to work lol */
		$inject?: Jagwah.Provider.name[];
	}

}
