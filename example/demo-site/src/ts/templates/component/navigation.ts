/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Selector, Template } from 'jagwah';

@Template('navigation')
@Selector('[navigation]')
export class NavigationTemplate {
	constructor(
		private jagwah: Jagwah
	) {}

	public render(renderer: Jagwah.Template.render) {
		return renderer`
			<div class="col col-12">
				<nav class="clearfix md-col-10 lg-col-8 mx-auto p2">
					${this.leftNav()}
					${this.rightNav()}
				</nav>
			</div>
		`
	}

	private leftNav() {
		return Jagwah.wire()`
			<div class="col col-left">
				<a href="/" class="btn btn-bold">Jagwah</a>
			</div>
		`
	}
	private rightNav() {
		return Jagwah.wire()`
			<div class="col col-right">
				<a href="https://github.com/8eecf0d2/jagwah/wiki" target="_blank" class="btn">Docs</a>
				<a href="https://github.com/8eecf0d2/jagwah" target="_blank" class="btn">Github</a>
			</div>
			<div class="col col-right sm-show">
				<a href="/getting-started" class="btn">Getting Started</a>
			</div>
		`
	}
}
