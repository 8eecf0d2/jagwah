/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export class Radio {
	private listeners: Radio.Listener[] = [];

	constructor() {}

	public listen(name: string, callback: Radio.Listener.callback) {
		this.listeners.push({ name: name, callback: callback });
	}

	public emit(name: string, data?: any) {
		for(const listener of this.listeners) {
			if(listener.name === name) {
				listener.callback(data);
			}
		}
	}
}

export module Radio {
	export module Listener {
		export type name = string;
		export type callback = (data?: any) => void;
	}
	export interface Listener {
		name: Radio.Listener.name;
		callback: Radio.Listener.callback;
	}
}
