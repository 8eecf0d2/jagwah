/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Inject, Template, Selector, Helpers } from 'jagwah';
import { TodoProvider } from '../providers';

@Template('todo-form')
@Selector('#todo-form')
export class TodoFormTemplate {
	constructor(
		@Inject('$todo') private $todo: TodoProvider,
		@Inject('$sync') private $sync: Jagwah.Provider.SyncProvider,
	) {}

	public render(render: Jagwah.Template.render) {
		return render`
			<div>
				${this.sectionForm()}
			</div>
		`;
	}

	private sectionForm() {
		return Jagwah.wire(this.$todo.temp)`
			<form onsubmit=${(e: Event) => this.$todo.add(e)}>
				<input type="text" oninput=${this.$sync.silent(this.$todo.temp, 'text')} value="${Helpers.safeGet(this.$todo.temp, 'text')}" placeholder="Todo item">
				<input type="submit" value="Add">
			</form>
		`;
	}
}
