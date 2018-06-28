/*
 * hyperbole by 8eecf0d2
 */

export class http {
	static options: http.options = {
		credentials: 'include',
	}

	static async fetch<T>(url: string, options: http.options) {
		const _options = Object.assign({}, options, http.options);
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

	static async get<T>(url: string, options: http.options = http.options) {
		const _options = Object.assign({
			method: 'GET',
		}, options, http.options);
		return http.fetch<T>(url, _options)
	}

	static async post<T>(url: string, body: http.fetch.body = {}, options: http.options = http.options) {
		const _options = Object.assign({
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		}, options, http.options);
		return http.fetch<T>(url, _options)
	}
}

export module http {
	export module fetch {
		/** todo: add buffer support */
		export type body = any;
	}
	export interface options extends RequestInit {
		method?: 'POST' | 'GET';
	}
}
