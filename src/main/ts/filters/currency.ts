/*
 * hyperbole by 8eecf0d2
 */

export function currency(value: number, symbol: string = '$') {
	return `${symbol}${value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
}
