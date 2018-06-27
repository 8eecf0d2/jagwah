/*
 * hyperbole by 8eecf0d2
 */

import * as _currency from './currency';

export module Filters {
	/** external */
	export const external: { [key: string]: any } = {}
	export const add = (name: string, fn: any) => {
		Filters.external[name] = fn;
	}

	/** built-in */
	export const currency = _currency;
}
