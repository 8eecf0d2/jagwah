/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function Middleware(type: string, middleware: any[]) {
	return (target: any) => {
		target[`$${type}`] = middleware;
	}
}
