/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Selector, Template } from 'jagwah';

declare var require: any;

@Template('getting-started')
@Selector('[main]')
export class GettingStartedTemplate {
	static markdown = {
		overview: require('./markdown/overview.md'),
	}

	constructor(
		private jagwah: Jagwah
	) {}

	public render(renderer: Jagwah.template.render) {
		return renderer`
			<content class="col col-12">
				<content class="col col-12 p4 hero-shape-3 flex">
					<div class="col col-12 mx-auto flex flex-center">
						<div class="col col-12 center fg-steel">
							<h1 class="mt1">Getting Started</h1>
							<p>Learn how to use <strong>hyperbolé</strong> and start building brilliant applications.</p>
						</div>
					</div>
				</content>

				<content class="col col-12 p3">
					<div class="md-col-10 lg-col-8 mx-auto">
						${this.section(GettingStartedTemplate.markdown.overview)}
						To learn more, <a href="https://8eecf0d2.gitbook.io/jagwah/" target="_blank">read the docs on gitbook</a>.
					</div>
				</content>

			</content>
		`
	}

	public section(content: string) {
		return Jagwah.html`
			<section class="col col-12">
				${{ html: content }}
			</section>
		`
	}
}
