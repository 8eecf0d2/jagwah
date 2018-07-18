/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Route(route: RegExp) {
	return (target: any) => {
		target.$route = route;
	}
}
