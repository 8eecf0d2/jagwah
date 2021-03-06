/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { safeGet as _safeGet } from './safe-get';
import { safeSet as _safeSet } from './safe-set';

export namespace Helpers {
	/** external */
	export const external: { [key: string]: any } = {}
	export const add = (name: string, fn: any) => {
		Helpers.external[name] = fn;
	}

	/** built-in */
	export const safeGet = _safeGet;
	export const safeSet = _safeSet;
}
