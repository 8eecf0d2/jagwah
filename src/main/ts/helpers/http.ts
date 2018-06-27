/*
 * hyperbole by 8eecf0d2
 */

/**
 * TODO: currently only intended for json requests,
 * probably best to refactor into a more capable
 * http helper class with different methods and
 * whatnot..
 */
export async function http(method: string, url: string, body?: any): Promise<IHTTPData> {
	let result: IHTTPData;
	await fetch(url,
		{
			method: method.toUpperCase(),
			body: JSON.stringify(body),
			credentials: 'include',
			headers: method.toUpperCase() === 'POST' ? {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			} : {}
		})
	.then(response => {
		result = response;
		return response.json()
	})
	.then(response => {
		result.data = response;
	});

	if(result.status >= 200 && result.status <= 299) {
		return result;
	} else {
		throw result;
	}
}

export interface IHTTPData extends Response {
	data?: any;
}
