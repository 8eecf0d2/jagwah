/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Templates(templates: any[]) {
	return (target: any) => {
		target.$templates = templates;
	}
}
