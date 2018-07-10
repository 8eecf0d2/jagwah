/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function Selector(selector: string) {
	return (target: any) => {
		target.$selector = selector;
	}
}
