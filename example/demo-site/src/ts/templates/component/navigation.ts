/*
 * 8eecf0d2/hyperbole - 2018
 */

import { Hyperbole, Selector, Template } from 'hyperbole';

@Template('navigation')
@Selector('[navigation]')
export class NavigationTemplate {
	constructor(
		private hyperbole: Hyperbole
	) {}

	public render(renderer: Hyperbole.template.render) {
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
		return Hyperbole.html`
			<div class="col col-left">
				<a href="/" class="btn btn-bold">hyperbolé</a>
			</div>
		`
	}
	private rightNav() {
		return Hyperbole.html`
			<div class="col col-right">
				<a href="https://github.com/8eecf0d2/hyperbole/wiki" target="_blank" class="btn">Docs</a>
				<a href="https://github.com/8eecf0d2/hyperbole" target="_blank" class="btn">Github</a>
			</div>
			<div class="col col-right sm-show">
				<a href="/getting-started" class="btn">Getting Started</a>
			</div>
		`
	}
}
