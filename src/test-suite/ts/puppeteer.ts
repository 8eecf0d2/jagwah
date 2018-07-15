/*
 * jagwah - https://github.com/8eecf0d2/jagwah
 */

import * as puppeteer from 'puppeteer';
import * as path from 'path';

export class Browser {
	public browser: puppeteer.Browser;
	constructor() {}

	public async start() {
		this.browser = await puppeteer.launch({
			headless: false
		});
		const page = await this.browser.newPage();
		const filepath = path.resolve(__dirname, '../../main/ts/index.spec.js');
		console.log(filepath)
		page.setContent('<html></html>');
		page.addScriptTag({
			path: filepath
		});
	}

	public async goto() {
	}
}

const browser = new Browser();
browser.start();
