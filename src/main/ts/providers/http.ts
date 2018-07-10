/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

import { Hyperbole, Helpers } from '../';

export class HttpProvider {
	static $provider = '$http';
	static $inject = ['$hyperbole'];

	static options: HttpProvider.options = {
		credentials: 'include',
	}

	public async fetch<T>(url: string, options: HttpProvider.options) {
		const _options = Object.assign({}, options, HttpProvider.options);
		const response = await fetch(url, _options);

		if(response.status >= 200 && response.status <= 299) {
			const data = <T>await response.json();
			return {
				...response,
				data: data
			};
		} else {
			throw response;
		}
	}

	public async get<T>(url: string, options: HttpProvider.options = HttpProvider.options) {
		const _options = Object.assign({
			method: 'GET',
		}, options, HttpProvider.options);
		return this.fetch<T>(url, _options)
	}

	public async post<T>(url: string, body: HttpProvider.fetch.body = {}, options: HttpProvider.options = HttpProvider.options) {
		const _options = Object.assign({
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		}, options, HttpProvider.options);
		return this.fetch<T>(url, _options)
	}
}

export module HttpProvider {
	export module fetch {
		/** todo: add buffer support */
		export type body = any;
	}
	export interface options extends RequestInit {
		method?: 'POST' | 'GET';
	}
}
