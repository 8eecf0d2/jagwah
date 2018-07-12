/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Helpers } from '../';

export class SyncProvider {
	static $provider = '$sync';
	static $inject = ['$Jagwah'];
	constructor(
		private $jagwah: Jagwah,
	) {}

	public update(obj: any, path: string) {
		return this.raw(obj, path, true)
	}

	public silent(obj: any, path: string) {
		return this.raw(obj, path, false)
	}

	private raw(obj: any, path: string, update: boolean = false) {
		return (el: any) => {
			Helpers.safeSet(obj, path, el.target.value);
			if(update === true) {
				this.$jagwah.update();
			}
		}
	}
}
