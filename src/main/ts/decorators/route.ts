/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function Route(route: string) {
	return (target: any) => {
		target.$route = route;
	}
}
