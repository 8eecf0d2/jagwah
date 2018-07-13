/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export class Deferred<T> {
	readonly id: string;
	public promise: Promise<T>;
	public resolve: (value?: T | PromiseLike<T>) => void;
	public reject: (reason?: any) => void;
	constructor(id?: string) {
		this.id = id || null;
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}
