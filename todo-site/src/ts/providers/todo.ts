/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Inject, Provider } from 'jagwah';

@Provider('$todo')
export class TodoProvider {
	public items: TodoItem[] = [
		{
			text: 'Example todo item 1',
		},{
			text: 'Example todo item 2',
		}
	];
	public temp: TodoItem;

	constructor(
		@Inject('$jagwah') private $jagwah: Jagwah,
	) {
		this.reset();
	}

	public add(e: Event) {
		e.preventDefault();
		this.items.push(this.temp);
		this.reset();
		this.$jagwah.update();
	}

	public remove(index: number) {
		this.items.splice(index, 1);
		this.$jagwah.update();
	}

	public reset() {
		this.temp = { text: '' };
	}
}

export interface TodoItem {
	text: string;
}
