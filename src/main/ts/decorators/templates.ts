/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Templates(type: 'before'|'after'|any[], templates?: any[]) {
	if(typeof type !== 'string') {
		templates = type;
		type = 'after';
	}
	return (target: any) => {
		target[`$${type}templates`] = templates;
	}
}
