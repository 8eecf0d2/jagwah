/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Inject, Template, Selector } from 'jagwah';
import { TodoProvider, TodoItem } from '../providers';

@Template('todo-list')
@Selector('#todo-list')
export class TodoListTemplate {
	constructor(
		@Inject('$todo') private $todo: TodoProvider,
	) {}

	public render(render: Jagwah.Template.render) {
		return render`
			<ul>
				${this.$todo.items.map((item, index) => this.sectionTodoItem(item, index))}
			</ul>
		`;
	}

	private sectionTodoItem(item: TodoItem, index: number) {
		const removeStyle = {
			color: 'red',
			cursor: 'pointer',
		}
		return Jagwah.wire(item)`
			<li>${item.text} <span class="remove" onclick=${() => this.$todo.remove(index)}>&times;</span></li>
		`;
	}
}
