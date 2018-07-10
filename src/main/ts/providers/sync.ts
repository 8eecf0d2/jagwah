/*
 * hyperbole by 8eecf0d2
 */

import { Hyperbole, Helpers } from '../';

export class SyncProvider {
	static $provider = '$sync';
	static $inject = ['$hyperbole'];
	constructor(
		private $hyperbole: Hyperbole,
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
				this.$hyperbole.update();
			}
		}
	}
}
