/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function Templates(templates: any[]) {
	return (target: any) => {
		target.$templates = templates;
	}
}
