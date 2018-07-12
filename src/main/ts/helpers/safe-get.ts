/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

/** Safely get a deeply nested property with a path that may or may not exist */
export function safeGet(obj: any, path: string|string[], value: any = undefined): any {
	return (Array.isArray(path) ? path : path.split('.')).reduce((a, b, i, s) => {
		return a && b ? a[b] : value;
	}, obj);
}
