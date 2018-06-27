/*
 * hyperbole by 8eecf0d2
 */

/**
 * TODO: possibly extends for 2 way binding...
 * not sure if I like the idea of two way binding
 * or not... maybe leverage proxies(?)
 */
export function sync(obj: any, prop: string) {
	return (el: any) => {
		obj[prop] = el.target.value;
	}
}
