/*
 * hyperbole by 8eecf0d2
 */

export function safeGet(obj: any, path: string|string[], value: any = undefined): any {
	return (Array.isArray(path) ? path : path.split('.')).reduce((a, b, i, s) => {
		return a && b ? a[b] : value;
	}, obj);
}
