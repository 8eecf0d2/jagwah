/*
 * hyperbole by 8eecf0d2
 */

export function Selector(selector: string) {
	return (target: any) => {
		target.$selector = selector;
	}
}
