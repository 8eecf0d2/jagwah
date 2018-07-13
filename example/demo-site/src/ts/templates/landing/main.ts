/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import { Jagwah, Selector, Template } from 'jagwah';

@Template('landing')
@Selector('[main]')
export class LandingTemplate {
	constructor(
		private jagwah: Jagwah
	) {}

	public render(renderer: Jagwah.template.render) {
		return renderer`
			<content class="col col-12">
				<content class="col col-12 p4 hero-shape-0 flex">
					<div class="col col-12 mx-auto flex flex-center">
						<div class="col col-12 center fg-steel">
							<h1 class="mt1">Rapid Web Development</h1>
							<p>Use <strong>hyperbolé</strong> to build fast, reliable and accessible web applications.</p>
						</div>
					</div>
				</content>

				<content class="col col-12">
					<div class="md-col-10 lg-col-8 mx-auto flex">
						<div class="col md-show col-4 flex flex-center">
							<img src="/asset/img/shapes/shape-2.svg" width="100%" height="100%">
						</div>
						<div class="col md-col-8 p3 flex flex-center">
							<div class="mx-auto fg-steel">
								<h2>Iterate Quickly</h2>
								<p>Developing with <strong>hyperbolé</strong> is super time efficient, instead of configuring builds or refactoring structure you can just write features and ship products.</p>
							</div>
						</div>
					</div>
				</content>

				<content class="col col-12 bg-mute">
					<div class="md-col-10 lg-col-8 mx-auto flex">
						<div class="col md-col-7 p3 flex flex-center">
							<div class="mx-auto fg-steel">
								<h2>Lightweight & Portable</h2>
								<p>Modern tooling allows tree-shaking out of the box, this entire site's javascript is only <code>6kb</code> and practically redundant thanks to server side rendering.</p>
							</div>
						</div>
						<div class="col md-show col-5 flex flex-center">
							<img src="/asset/img/shapes/shape-1.svg" width="100%" height="100%">
						</div>
					</div>
				</content>

				<content class="col col-12">
					<div class="md-col-10 lg-col-8 mx-auto flex">
						<div class="col md-show col-6 flex flex-center">
							<img src="/asset/img/shapes/shape-3.svg" width="100%" height="100%">
						</div>
						<div class="col md-col-6 p3 flex flex-center">
							<div class="mx-auto fg-steel">
								<h2>Easy to Learn</h2>
								<p>You can use whatever Javascript stuff you like with <strong>hyperbolé</strong>, whether it's <code>classes</code> <code>functions</code> or just plain old <code>objects</code> - you're able to use whatever works best for you.</p>
							</div>
						</div>
					</div>
				</content>

				<content class="col col-12 bg-steel">
					<div class="md-col-10 lg-col-8 mx-auto">
						<div class="col col-12 p3">
							<div class="mx-auto fg-undercoat mt2">
								<p>The goal of <strong>hyperbolé</strong> is to create a rapid, modern and enjoyable web development experience.<br>This isn't Angular with philosophical questions about the creation of life, nor React and friends with their impetus of being <span class="italic">reactful</span>, it's just a web framework that works.</p>
								<p>If you're curious about the name - scroll back up the top and read this page again.</p>
								<p></p>
							</div>
						</div>
					</div>
				</content>

			</content>
		`
	}
}
