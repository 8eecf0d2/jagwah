# hyperbolé

Wrapper for the awesome hyperHtml renderer written in Typescript.

### Getting Started

Install with yarn or npm​

```bash
yarn add hyperbole
```

Import and start using

```ts
import { Hyperbole } from 'hyperbole';
​
const hyperbole = new Hyperbole();
hyperbole.provider(...);
hyperbole.template(...);
...
hyperbole.start();
```


### [Documentation](https://github.com/8eecf0d2/hyperbole/wiki)

All of the documentation can be found in [this repo's github wiki](https://github.com/8eecf0d2/hyperbole/wiki), it's not perfectly up to date with the latest changes but provides a good overview. Organizing and validating documentation will be the focus of release `0.0.2`, for now the focus is features and stability in [`0.0.1`](https://github.com/8eecf0d2/hyperbole/projects/1).

### Overview

hyperbolé is a small wrapper for hyperHtml and a couple other tools, it feels a bit like AngularJs mixed with React, ~~for the most part it get's out of the way and lets you write web applications however you want~~ _as of right now it's got some strong opinions about how you should write web applications with it._

### Example

Below is a really simple example of hyperbolé, it uses a single Template without Providers or Routes.

`main.ts`
```ts
import { Hyperbole, Selector } from 'hyperbole';
​
const hyperbole = new Hyperbole();
​
@Template('hello-world')
@Selector('#hello-world')
class HelloWorldTemplate {
    constructor(
        private render: Hyperbole.template.render
    ) {
        return render`
            <h1>Hello World</h1>
        `
    }
}
​
hyperbole.template(HelloWorldTemplate);
​
hyperbole.start();
```

`index.html`
```html
<body>
    <div id="hello-world"></div>
</body>
```

`result.png`
![hello world with hyperbole](https://i.imgur.com/Yu7GYaK.png)

### Credits

All of the really hard work was done by [WebReflection](https://github.com/WebReflection) and the contributors of [hyperHtml](https://github.com/WebReflection/hyperHtml/graphs/contributors).

[hyperbolé](https://github.com/8eecf0d2/hyperbole) was created by [Contributors](https://github.com/8eecf0d2/hyperbole/graphs/contributors)

[hyperHtml](https://github.com/WebReflection/hyperHtml) was created by [WebReflection](https://github.com/WebReflection)
