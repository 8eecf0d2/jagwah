/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export function currency(value: number, symbol: string = '$') {
	return `${symbol}${value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
}
