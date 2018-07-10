/*
 * Hyperbolé - https://github.com/8eecf0d2/hyperbole
 */

export class Radio {
	private listeners: IRadioListener[] = [];
	constructor() {}

	public listen(name: string, callback: IRadioListenerCallback) {
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

export interface IRadioListener {
	name: string;
	callback: IRadioListenerCallback;
}

export type IRadioListenerCallback = (data?: any) => void;
