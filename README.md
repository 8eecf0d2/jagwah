# Jagwah

Simple web application framework with HyperHTML & Typescript.

### Getting Started

Install with yarn or npm​

```bash
yarn add jagwah
```

Import and start using

```ts
import { Jagwah } from 'jagwah';
​
const jagwah = new Jagwah({
  providers: { ... },
  templates: { ... }
});
...
jagwah.start();
```


### [Documentation](https://github.com/8eecf0d2/jagwah/wiki)

All of the documentation can be found in [the github wiki](https://github.com/8eecf0d2/jagwah/wiki), it's not perfectly up to date with the latest changes but provides a good overview. Organizing and validating documentation is the focus of minor release [`0.2.0`](https://github.com/8eecf0d2/jagwah/projects/4).

### Overview

jagwah is a small wrapper for hyperHtml and a couple other tools, it feels a bit like AngularJs mixed with React, ~~for the most part it get's out of the way and lets you write web applications however you want~~ _as of right now it's got some strong opinions about how you should write web applications with it._

### Example

Below is a really simple example of jagwah, it uses a single Template without Providers or Routes.

`main.ts`
```ts
import { Jagwah, Selector } from 'jagwah';
​
const jagwah = new Jagwah();
​
@Template('hello-world')
@Selector('#hello-world')
class HelloWorldTemplate {
  constructor() {}
  return render(private render: Jagwah.Template.render) {
    return render`
      <h1>Hello World</h1>
    `;
  }
}
​
jagwah.Template(HelloWorldTemplate);
​
jagwah.start();
jagwah.update();
```

`index.html`
```html
<body>
  <div id="hello-world"></div>
</body>
```

`result.png`
![hello world with jagwah](https://i.imgur.com/Yu7GYaK.png)

### Credits

All of the really hard work was done by [WebReflection](https://github.com/WebReflection) and the contributors of [hyperHtml](https://github.com/WebReflection/hyperHtml/graphs/contributors).

[Jagwah](https://github.com/8eecf0d2/jagwah) was created by [Contributors](https://github.com/8eecf0d2/jagwah/graphs/contributors)

[hyperHtml](https://github.com/WebReflection/hyperHtml) was created by [WebReflection](https://github.com/WebReflection)
