/*
 * 8eecf0d2/hyperbole - 2018
 */

import { Selector, Template, Hyperbole } from 'hyperbole';

@Template('footer')
@Selector('[footer]')
export class FooterTemplate {
	constructor(
		private hyperbole: Hyperbole
	) {}

	public render(renderer: Hyperbole.template.render) {
		return renderer`
			<footer class="col col-12 bg-mute">
				<nav class="clearfix md-col-10 lg-col-8 mx-auto p2 mt1">
					<div class="col col-left">
						<a href="/" class="btn">hyperbolé</a>
					</div>
					<div class="col col-right">
						<a href="https://8eecf0d2.gitbook.io/hyperbole/" target="_blank" class="btn">Docs</a>
						<a href="https://github.com/8eecf0d2/hyperbole" class="btn">Github</a>
					</div>
				</nav>
			</footer>
		`
	}
}
