/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export function Inject(name: string) {
	return (target: any, key: string, index: number): void => {
		if(!target.$inject) { target.$inject = [] }
		target.$inject.unshift(name);
	}
}
