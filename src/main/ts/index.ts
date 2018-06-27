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

	private _providersCache: Hyperbole.providers = {};
	private _templatesCache: Hyperbole.template[] = [];
	private _templatesActive: Hyperbole.template[] = [];

	constructor() {}

	/**
	 * Preferably get rid of this method but for now it's
	 * required to kickstart hyperApp routing on page-load
	 */
	public async start(options?: Hyperbole.options) {
		if(options.providers) { this.providers(options.providers) }
		if(options.routes) { this.routes(options.routes) }
		if(options.templates) { this.templates(options.templates) }

		if(options.before) {
			await Promise.all(options.before.map(fn => {
				const dependencies = this.getDependecies(fn.$inject);
				return new fn(this, ...dependencies).task();
			}))
		}
		// hack to kickstart hyperApp.
		this.router.navigate(window.location.pathname);
		if(!options.noUpdate) {
			this.update();
		}
		if(options.after) {
			await Promise.all(options.after.map(fn => {
				const dependencies = this.getDependecies(fn.$inject);
				return new fn(this, ...dependencies).task();
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
		const dependencies = this.getDependecies(provider.$inject);
		this._providersCache[provider.$provider] = new provider(this, ...dependencies);
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
		const dependencies = this.getDependecies(route.$inject);
		const _route = new route(this, ...dependencies)
		this.router.get(route.$route, async (ctx: any) => {
			if(_route.before) {
				await _route.before(ctx);
			}
			this.update();
			if(_route.after) {
				await _route.after(ctx);
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
	private getDependecies(names: string[] = []): any[] {
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
			const dependencies = this.getDependecies(template.fn.$inject);
			const templateInstance = new template.fn(this, ...dependencies);
			templateInstance.render(template.$element);
		}
	}
}

export module Hyperbole {

	// hyperHtml stuff
	export const html = hyperHTML.hyper;
	export const wire = hyperHTML.wire;
	export const bind = hyperHTML.bind;

	// hyperHtml-app stuff
	export interface router {
		navigate: (path: string) => void;
		get: (path: string, callback: (ctx: any) => void) => void;
	}

	export interface options {
		before?: any[];
		after?: any[];

		providers?: any;
		routes?: any;
		templates?: any;

		noUpdate?: boolean;
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
		$element: TemplateFunction<any>;
		fn: any;
	}
	export module template {
		export type render = hyperHTML.WiredTemplateFunction;
	}

	export interface providers {
		[ProviderName: string]: any;
	}
}

export type IHyperboleTemplateRender = (render: hyperHTML.WiredTemplateFunction, ...providers: any[]) => TemplateFunction<any>;

export type TemplateFunction<T> = (template: TemplateStringsArray, ...values: any[]) => T;
