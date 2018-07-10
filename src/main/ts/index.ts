/*
 * hyperbole by 8eecf0d2
 */

//@ts-ignore
import * as hyperApp from 'hyperhtml-app';
import * as hyperhtml from 'hyperhtml/cjs';


export * from './filters';
export * from './helpers';
export * from './decorators';

export class Hyperbole {
	public initialized: boolean = false;
	public router: Hyperbole.router = hyperApp();

	public constants: { [key: string]: any };

	/** all providers */
	private providers: Hyperbole.Provider.set = {};
	/** all templates */
	private templates: Hyperbole.template[] = [];
	/** templates currently in use */
	private _templates: Hyperbole.template[] = [];

	constructor(
		options: Hyperbole.options = {},
	) {
		this.constants = options.constants;

		/** initialize "this" as provider $hyperbole */
		this.providers['$hyperbole'] = this;


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
	 * Set a Template for rendering.
	 */
	public Template(template: Hyperbole.Template, selector?: string) {
		const dependencies = this.Dependencies(template.$inject);
		const temp: Hyperbole.template = {
			$selector: selector || template.$selector,
			$template: template.$template,
			$element: hyperhtml.bind(document.querySelectorAll(selector || template.$selector)[0]),
			instance: new template(...dependencies),
		}

		/** add template to cached templates (based on name) */
		let existingCachedTemplateIndex = this.templates.findIndex(_template => _template.$template === temp.$template);
		if(existingCachedTemplateIndex === -1) {
			this.templates.push(temp);
			existingCachedTemplateIndex = this.templates.length - 1;
		}

		/** add / replace template in active templates (based on selector) */
		let existingActiveTemplateIndex = this._templates.findIndex(_template => _template.$selector === this.templates[existingCachedTemplateIndex].$selector);
		if(existingActiveTemplateIndex === -1) {
			this._templates.push(this.templates[existingCachedTemplateIndex]);
		} else {
			this._templates[existingActiveTemplateIndex] = this.templates[existingCachedTemplateIndex];
		}
	}

	/**
	 * Set a Provider for state management.
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
	public async Middleware(middleware: Hyperbole.Middleware) {
		const middlewareDependencies = this.Dependencies(middleware.$inject);
		return middleware.middleware(...middlewareDependencies);
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
	public update(options?: Hyperbole.update.options) {
		// let templates = this._templates;
		// if(options && options.include) {
		// 	templates = templates.filter(template => {
		// 		return options.include.includes(template.$selector);
		// 	});
		// }
		for(const template of this._templates) {
			template.instance.render(template.$element);
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
			before?: Function[];
			after?: Function[];
		}
	}

	export module update {
		export interface options {
			exclude?: string[];
			include?: string[];
		}
	}

	export interface template {
		$selector: string;
		$template: string;
		$element: Hyperbole.template.instance<any>;
		instance: any;
	}

	export module template {
		export type render = hyperhtml.WiredTemplateFunction;
		export type instance<T> = (template: TemplateStringsArray, ...values: any[]) => T;
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
		export type render = hyperhtml.WiredTemplateFunction;
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
		$templates?: Hyperbole.Template.name[];
		$inject?: Hyperbole.Provider.name[];
		$before?: Hyperbole.Middleware[];
		$after?: Hyperbole.Middleware[];
	}

	/** Middleware */
	export module Middleware {
		export interface instance {
			middleware: (...dependencies: Hyperbole.Provider.instance[]) => void;
		}
	}
	export interface Middleware {
		new(...params: any[]): Hyperbole.Route.instance;
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
