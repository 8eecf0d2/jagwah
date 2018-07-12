/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

export class Radio {
	private int: number = 0;
	private listeners: Radio.Listener.set = {};

	constructor() {}

	public listen(name: string, callback: Radio.Listener.callback): Radio.Listener.ref {
		if(!this.listeners[name]) {
			this.listeners[name] = [];
		}

		this.listeners[name].push({ id: String(this.int++), callback: callback });

		return { name: name, id: String(this.int) };
	}

	public emit(name: string, data?: any) {
		if(this.listeners[name]) {
			for(const listener in this.listeners[name]) {
				this.listeners[name][listener].callback(data);
			}
		}
	}

	public remove(ref: Radio.Listener.ref) {
		const index = this.listeners[ref.name].findIndex(listener => listener.id === ref.id);
		if(index > -1) {
			this.listeners[ref.name].splice(index, 1);
		}
	}
}

export module Radio {
	export module Listener {
		export type name = string;
		export type callback = (data?: any) => void;
		export interface set {
			[name: string]: Radio.Listener[];
		}
		export interface ref {
			name: string;
			id: string;
		}
	}
	export interface Listener {
		id: string;
		callback: Radio.Listener.callback;
	}
}
