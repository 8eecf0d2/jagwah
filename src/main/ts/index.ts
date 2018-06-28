/*
 * hyperbole by 8eecf0d2
 */

//@ts-ignore
import * as hyperApp from 'hyperhtml-app';
import * as hyperHTML from 'hyperhtml/cjs';

export * from './filters';
export * from './helpers';
export * from './decorators';

export class Hyperbole {
	public router: Hyperbole.router = hyperApp();

	public constants: { [key: string]: any };

	private _providersCache: Hyperbole.providers = {};
	private _templatesCache: Hyperbole.template[] = [];
	private _templatesActive: Hyperbole.template[] = [];

	constructor() {}

	/**
	 * Preferably get rid of this method but for now it's
	 * required to kickstart hyperApp routing on page-load
	 */
	public async start(options: Hyperbole.options = {}) {

		/** initiallize "this" as provider $provider */
		this._providersCache['$hyperbole'] = this;

		this.constants = options.constants;

		if(options.providers) { this.providers(options.providers) }
		if(options.routes) { this.routes(options.routes) }
		if(options.templates) { this.templates(options.templates) }

		if(options.before) {
			await Promise.all(options.before.map(fn => {
				const dependencies = this.dependencies(fn.$inject);
				return new fn(...dependencies).task();
			}))
		}

		// hack to kickstart hyperApp.
		this.router.navigate(window.location.pathname);

		/**
		 * if there are routes, an update() will be called
		 * when that routes is handled, otherwise we need to
		 * call it here.
		 */
		if(!options.routes) {
			this.update();
		}

		if(options.after) {
			await Promise.all(options.after.map(fn => {
				const dependencies = this.dependencies(fn.$inject);
				return new fn(...dependencies).task();
			}))
		}
	}

	/**
	 * Set a Template for rendering.
	 */
	public template(template: any, selector?: string) {
		const temp: Hyperbole.template = {
			$selector: selector || template.$selector,
			$template: template.$template,
			$element: hyperHTML.bind(document.querySelectorAll(selector || template.$selector)[0]),
			fn: template
		}

		/** add template to cached templates (based on name) */
		let existingCachedTemplateIndex = this._templatesCache.findIndex(_template => _template.$template === temp.$template);
		if(existingCachedTemplateIndex === -1) {
			this._templatesCache.push(temp);
			existingCachedTemplateIndex = this._templatesCache.length - 1;
		}

		/** add / replace template in active templates (based on selector) */
		let existingActiveTemplateIndex = this._templatesActive.findIndex(_template => _template.$selector === this._templatesCache[existingCachedTemplateIndex].$selector);
		if(existingActiveTemplateIndex === -1) {
			this._templatesActive.push(this._templatesCache[existingCachedTemplateIndex]);
		} else {
			this._templatesActive[existingActiveTemplateIndex] = this._templatesCache[existingCachedTemplateIndex];
		}
	}

	/**
	 * Set Templates based on an object containing many Templates.
	 */
	public templates(templates: { [name: string]: any }) {
		for(const template in templates) {
			this.template(templates[template]);
		}
	}

	/**
	 * Set a Provider for state management.
	 */
	public provider(provider: any) {
		const dependencies = this.dependencies(provider.$inject);
		this._providersCache[provider.$provider] = new provider(...dependencies);
	}

	/**
	 * Set Providers based on an object containing many Providers.
	 */
	public providers(providers: { [name: string]: any }) {
		for(const provider in providers) {
			this.provider(providers[provider]);
		}
	}

	/**
	 * Add a route with templates / callbacks
	 */
	public route(route: any) {
		const dependencies = this.dependencies(route.$inject);
		const _route = new route(...dependencies);
		this.router.get(route.$route, async (ctx: any) => {
			/** run route $before middleware */
			if(route.$before) {
				for(const middleware of route.$before) {
					const middlewareDependencies = this.dependencies(middleware.$inject);
					const _middleware = await new middleware(...middlewareDependencies).middleware();
				}
			}

			/** run route before method */
			if(_route.before) {
				await _route.before(ctx)
			}

			/** set any route templates */
			if(route.$templates) {
				this.templates(route.$templates);
			}

			/** update / render templates */
			this.update();

			/** run route after method */
			if(_route.after) {
				await _route.after(ctx)
			}

			/** run route $after middleware */
			if(route.$after) {
				for(const middleware of route.$after) {
					const middlewareDependencies = this.dependencies(middleware.$inject);
					const _middleware = await new middleware(...middlewareDependencies).middleware();
				}
			}
		});
	}

	/**
	 * Set Routes based on an object containing many Routes.
	 */
	public routes(routes: { [name: string]: any }) {
		for(const route in routes) {
			this.route(routes[route]);
		}
	}

	/**
	 * Get dependencies from array of dependency names.
	 */
	private dependencies(names: string[] = []): any[] {
		const dependencies = [];
		for(const injectName of names) {
			if(this._providersCache[injectName]) {
				dependencies.push(this._providersCache[injectName]);
			}
		}
		return dependencies;
	}

	/**
	 * Update registered templates
	 */
	public update(options?: Hyperbole.update.options) {
		let templates = this._templatesActive;
		if(options && options.include) {
			templates = templates.filter(template => {
				return options.include.includes(template.$selector);
			})
		}
		this.render(templates);
	}

	private render(templates: Hyperbole.template[]) {
		for(const template of templates) {
			const dependencies = this.dependencies(template.fn.$inject);
			const templateInstance = new template.fn(...dependencies);
			templateInstance.render(template.$element);
		}
	}
}

export module Hyperbole {

	/** hyperHtml stuff */
	export const html = hyperHTML.hyper;
	export const wire = hyperHTML.wire;
	export const bind = hyperHTML.bind;
	export const Component = hyperHTML.Component;

	/** hyperHtml-app stuff */
	export interface router {
		navigate: (path: string) => void;
		get: (path: string, callback: (ctx: any) => void) => void;
	}

	export interface options {
		before?: any[];
		after?: any[];

		constants?: { [key: string]: any };
		providers?: any;
		routes?: any;
		templates?: any;
	}

	export module route {
		export type callback = (ctx: any, ...args: any[]) => Promise<void>;
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
		$element: Hyperbole.template.fn<any>;
		fn: any;
	}

	export module template {
		export type render = hyperHTML.WiredTemplateFunction;
		export type fn<T> = (template: TemplateStringsArray, ...values: any[]) => T;
	}

	export interface providers {
		[ProviderName: string]: any;
	}
}
