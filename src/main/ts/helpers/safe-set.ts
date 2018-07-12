/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function safeSet(obj: any, path: string|string[], value: any): any {
	return (Array.isArray(path) ? path : path.split('.')).reduce((a, b, i, s) => {
		return a[b] = a[b] === undefined && b !== s[s.length - 1] ? {} : b === s[s.length - 1] ? value : a[b];
	}, obj);
}
