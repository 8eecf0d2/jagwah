/*
 * hyperbole by 8eecf0d2
 */

export function Middleware(type: string, middleware: any[]) {
	return (target: any) => {
		target[`$${type}`] = middleware;
	}
}
