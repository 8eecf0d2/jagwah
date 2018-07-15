/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import * as hyperhtml from 'hyperhtml/cjs';

import { Radio } from './radio';
import { Router } from './router';
import { Providers } from './providers';

export * from './helpers';
export * from './decorators';

export class Jagwah {
	public radio: Radio = new Radio();
	public router: Router = new Router();

	public constants: { [key: string]: any };

	private providers: Jagwah.Provider.set = {};
	private templates: Jagwah.Template.set = {};

	constructor(
		options: Jagwah.options = {},
	) {
		/** initialize constants */
		this.constants = options.constants;

		/** initialize "this" as provider $Jagwah */
		this.providers['$jagwah'] = this;

		/** initialize providers */
		const providers = [ Providers.SyncProvider, Providers.HttpProvider, ...(options.providers || []) ]
		for(const provider in providers) {
			this.Provider(providers[provider]);
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

	/** start the Jagwah application */
	public async start(options: Jagwah.start.options = {}) {
		if(options.before) {
			await Promise.all(options.before.map(BeforeHandler => {
				const dependencies = this.Dependencies(BeforeHandler.$inject);
				return new BeforeHandler(...dependencies).task();
			}));
		}

		this.router.start();

		if(options.after) {
			await Promise.all(options.after.map(AfterHandler => {
				const dependencies = this.Dependencies(AfterHandler.$inject);
				return new AfterHandler(...dependencies).task();
			}));
		}
		this.radio.emit(`jagwah:start`);
	}

	/**
	 * Initialize a Template for rendering.
	 */
	public Template(template: Jagwah.Template) {
		const dependencies = this.Dependencies(template.$inject);
		const _template: Jagwah.Template.copy = {
			$selector: template.$selector,
			$template: template.$template || 'anonymous',
			$element: hyperhtml.bind(document.querySelectorAll(template.$selector)[0]),
			instance: new template(...dependencies),
		}

		/** add / replace template in active templates (based on selector) */
		this.templates[_template.$selector] = _template;
		this.radio.emit(`jagwah:template:register`, template.$template || 'anonymous');
	}

	/**
	 * Initialize a Provider for state management.
	 */
	public Provider(provider: Jagwah.Provider) {
		const dependencies = this.Dependencies(provider.$inject);
		this.providers[provider.$provider] = new provider(...dependencies);
		this.radio.emit(`jagwah:provider:register`, provider.$provider);
	}

	/**
	 * Initialize a Route for state / templates changes.
	 */
	public Route(route: Jagwah.Route) {
		const dependencies = this.Dependencies(route.$inject);
		const routeInstance = new route(...dependencies);
		this.router.register(route.$route, async (context: Router.Context) => {
			this.radio.emit(`jagwah:router:update:before`, context);

			/** run route $before middleware */
			if(route.$before) {
				for(const middleware of route.$before) {
					await this.Middleware(middleware);
				}
			}

			/** run route before() method */
			if(routeInstance.before) {
				await routeInstance.before(context)
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
			if(routeInstance.after) {
				await routeInstance.after(context)
			}

			/** run route $after middleware */
			if(route.$after) {
				for(const middleware of route.$after) {
					await this.Middleware(middleware);
				}
			}

			this.radio.emit(`jagwah:router:update:after`, context);
		});
	}

	/**
	 * Handle middleware for route
	 */
	private async Middleware(middleware: Jagwah.Middleware.instance) {
		const middlewareDependencies = this.Dependencies(middleware.$inject);
		return middleware.task(...middlewareDependencies);
	}

	/**
	 * Get dependencies from array of dependency names.
	 */
	private Dependencies(names: Jagwah.Provider.name[] = []): Jagwah.Provider.instance[] {
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
		this.radio.emit(`jagwah:update`);
	}
}

export module Jagwah {
	/** hyperHtml */
	export const wire = hyperhtml.wire;
	export const bind = hyperhtml.bind;
	export const define = hyperhtml.define;

	export interface options {
		constants?: { [key: string]: any };
		providers?: Jagwah.Provider[];
		routes?: Jagwah.Route[];
		templates?: Jagwah.Template[];
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
			[ProviderName: string]: Jagwah.Provider.instance;
		}
		export interface instance {}

		/** Built-in Providers*/
		export type SyncProvider = Providers.SyncProvider;
		export type HttpProvider = Providers.HttpProvider;
	}
	export interface Provider {
		new(...dependencies: Jagwah.Provider.instance[]): Jagwah.Provider.instance;
		$provider?: Jagwah.Provider.name;
		$inject?: Jagwah.Provider.name[];
	}

	/** Template */
	export module Template {
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
	export module Route {
		export type path = string;
		export type middleware = hyperhtml.WiredTemplateFunction;
		export interface instance {
			before?: (context: Router.Context) => void;
			after?: (context: Router.Context) => void;
		}
	}
	export interface Route {
		new(...dependencies: Jagwah.Provider.instance[]): Jagwah.Route.instance;
		$route?: Jagwah.Route.path;
		$templates?: Jagwah.Template[];
		$inject?: Jagwah.Provider.name[];
		$before?: Jagwah.Middleware.instance[];
		$after?: Jagwah.Middleware.instance[];
	}

	/** Middleware */
	export module Middleware {
		export interface instance {
			task: (...dependencies: Jagwah.Provider.instance[]) => void;
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
