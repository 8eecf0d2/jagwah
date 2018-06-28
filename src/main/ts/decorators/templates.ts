/*
 * hyperbole by 8eecf0d2
 */

export function Templates(templates: any[]) {
	return (target: any) => {
		target.$templates = templates;
	}
}
