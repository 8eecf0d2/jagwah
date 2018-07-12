/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Selector(selector: string) {
	return (target: any) => {
		target.$selector = selector;
	}
}
