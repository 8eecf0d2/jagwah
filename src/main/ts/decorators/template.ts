/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function Template(template: string, selector?: string) {
	return (target: any) => {
		target.$template = template;
		if(selector) {
			target.$selector = selector;
		}
	}
}
