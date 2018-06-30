/*
 * hyperbole by 8eecf0d2
 */

import { http as _http } from './http';
import { sync as _sync } from './sync';
import { safeGet as _safeGet } from './safe-get';
import { safeSet as _safeSet } from './safe-set';

export module Helpers {
	/** external */
	export const external: { [key: string]: any } = {}
	export const add = (name: string, fn: any) => {
		Helpers.external[name] = fn;
	}

	/** built-in */
	export const http = _http;
	export const sync = _sync;
	export const safeGet = _safeGet;
	export const safeSet = _safeSet;
}
