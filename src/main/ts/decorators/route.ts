/*
 * hyperbole by 8eecf0d2
 */

export function Route(route: string) {
	return (target: any) => {
		target.$route = route;
	}
}
