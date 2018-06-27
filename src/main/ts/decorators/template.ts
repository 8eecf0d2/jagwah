/*
 * hyperbole by 8eecf0d2
 */

export function Template(template: string, selector?: string) {
	return (target: any) => {
		target.$template = template;
		if(selector) {
			target.$selector = selector;
		}
	}
}
