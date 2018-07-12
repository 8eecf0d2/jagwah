/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Middleware(type: string, middleware: any[]) {
	return (target: any) => {
		target[`$${type}`] = middleware;
	}
}
