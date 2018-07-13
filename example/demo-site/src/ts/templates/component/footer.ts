/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Selector, Template, Jagwah } from 'jagwah';

@Template('footer')
@Selector('[footer]')
export class FooterTemplate {
	constructor(
		private jagwah: Jagwah
	) {}

	public render(renderer: Jagwah.template.render) {
		return renderer`
			<footer class="col col-12 bg-mute">
				<nav class="clearfix md-col-10 lg-col-8 mx-auto p2 mt1">
					<div class="col col-left">
						<a href="/" class="btn">hyperbolé</a>
					</div>
					<div class="col col-right">
						<a href="https://8eecf0d2.gitbook.io/jagwah/" target="_blank" class="btn">Docs</a>
						<a href="https://github.com/8eecf0d2/jagwah" class="btn">Github</a>
					</div>
				</nav>
			</footer>
		`
	}
}
