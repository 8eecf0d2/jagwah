/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Provider(provider: string) {
	return (target: any) => {
		target.$provider = provider;
	}
}
