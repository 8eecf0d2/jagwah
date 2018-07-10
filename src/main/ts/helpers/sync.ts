/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

import { safeSet } from './safe-set';

/**
 * TODO: possibly extends for 2 way binding...
 * not sure if I like the idea of two way binding
 * or not... maybe leverage proxies(?)
 */
export function sync(obj: any, path: string) {
	return (el: any) => {
		safeSet(obj, path, el.target.value);
	}
}
