/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

import { safeGet as _safeGet } from './safe-get';
import { safeSet as _safeSet } from './safe-set';

export module Helpers {
	/** external */
	export const external: { [key: string]: any } = {}
	export const add = (name: string, fn: any) => {
		Helpers.external[name] = fn;
	}

	/** built-in */
	export const safeGet = _safeGet;
	export const safeSet = _safeSet;
}
