# Getting Started

To start using this [npm module](https://npmjs.com/package/captcha-canvas). We first need to install it from npm by using command `npm install captcha-canvas`.

Now require this package in your file where you want to create captcha.
```js
const { CaptchaGenerator } = require("captcha-canvas");
```

We can see here we get `CaptchaGenerator` class from the module. Now initiate the constructor to start using it.
```js
const { CaptchaGenerator } = require("captcha-canvas");
const captcha = new CaptchaGenerator();
```

Now we can use all the methods documented [here](https://captcha-canvas.js.org/CaptchaGenerator.html) to customize captcha according to our need.

Like if we want to use different dimension. We can use [setDimension](https://captcha-canvas.js.org/CaptchaGenerator.html#setDimension) method.
```js
const { CaptchaGenerator } = require("captcha-canvas");
const captcha = new CaptchaGenerator()
.setDimension(150, 450) 
```

If we want to change captcha text or its appearance, then we can use [setCaptcha](https://captcha-canvas.js.org/CaptchaGenerator.html#setCaptcha) method.
```js
const { CaptchaGenerator } = require("captcha-canvas");
const captcha = new CaptchaGenerator()
.setDimension(150, 450) 
.setCaptcha({text: "CUSTOM05", size: 60, color: "deeppink"})
```

If we want to change appearance of background text (i.e decoy). We can do that easily by using [setDecoy](https://captcha-canvas.js.org/CaptchaGenerator.html#setDecoy) method.
```js
const { CaptchaGenerator } = require("captcha-canvas");
const captcha = new CaptchaGenerator()
.setDimension(150, 450) 
.setCaptcha({text: "CUSTOM05", size: 60, color: "deeppink"})
.setDecoy({opacity: 0.5})
```

You can also customise trace line and add background by using [setTrace](https://captcha-canvas.js.org/CaptchaGenerator.html#setTrace) and [setBackground](https://captcha-canvas.js.org/CaptchaGenerator.html#setBackground) method.

Once you customised everything according to your need then just you can get buffer from `generateSync` method. And use that buffer to display image in your project.

```js
const { CaptchaGenerator } = require("captcha-canvas");
const captcha = new CaptchaGenerator()
.setDimension(150, 450) 
.setCaptcha({text: "CUSTOM05", size: 60, color: "deeppink"})
.setDecoy({opacity: 0.5})
.setTrace({color: "deeppink"});
const buffer = captcha.generateSync();
```

#### Final Output
![captcha](https://raw.githubusercontent.com/Shashank3736/captcha-canvas/master/examples/all.png)

## Support
To get help related to this module open an issue in the [github repository](https://github.com/Shashank3736/captcha-canvas). 
