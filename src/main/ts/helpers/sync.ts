/*
 * hyperbole by 8eecf0d2
 */

export function sync(obj: any, prop: string) {
	return (el: any) => {
		obj[prop] = el.target.value;
	}
}

