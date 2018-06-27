/*
 * hyperbole by 8eecf0d2
 */

export function Provider(provider: string) {
	return (target: any) => {
		target.$provider = provider;
	}
}
