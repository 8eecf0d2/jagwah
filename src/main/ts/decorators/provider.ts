/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function Provider(provider: string) {
	return (target: any) => {
		target.$provider = provider;
	}
}
