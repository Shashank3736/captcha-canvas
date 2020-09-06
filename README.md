# captcha-canvas
This is an npm package [captcha-canvas](https://npmjs.com/package/captcha-canvas) helps you to make custom captcha of all types. The package uses `canvas` and `canvas-constructor` to create captcha imagas. See installation section to know how to install. 

[![captcha-canvas](https://nodei.co/npm/captcha-canvas.png)](https://npmjs.com/package/captcha-canvas)

#### Captcha Image:

![captcha](https://github.com/Shashank3736/captcha-canvas/raw/master/assets/captcha/default.png)

### Features

* Highly customisable you can customise every single value use to make this package.
* 95% OCR fails to read this captcha image and throw Error.
* Use class constructor method so you can generate as many frames as many you want by using same values.
* No bundled dependenceris. You need to install them to use the package.
* Support of background images is also possible.
* Captcha adapt all the external options very easily.

## How to use?

```js
const { CaptchaGenerator } = require('captcha-canvas');  //require package here
const fs = require('fs'); //require fs module for saving image in a file
const options = {height: 200, width: 600};  //options for captcha image
const captcha = new CaptchaGenerator(options); //getting captcha constructor
captcha.captcha.text; //returns text of the captcha image.
const buffer = captcha.generate(); //returns buffer of the captcha image

fs.writeFileSync('image.png', buffer); //will create image.png file of the captcha
```

# Customisation 
You can customise captcha image by using available methods. All the options/methods are optional you really no need to add them inorder to use this package.

```js
const { CaptchaGenerator } = require('captcha-canvas');  //require package here
const captcha = new CaptchaGenerator();

captcha.setDimension(200, 600); //set heigth: 200 and width: 600 for the captcha image
captcha.setBackground(url/path); //set background for captcha if no value provide then background will be null
captcha.setCaptcha(captchaOptions); //set captcha text config. values
captcha.setTrace(traceOptions); //set trace line config.
captcha.setDecoy(decoyOptions); //set decoy options
```
**Captcha Options:**

captcha.characters (set length of captcha text)
captcha.text (set text for captcha)
captcha.color (set html color code for captcha text)
captcha.font (set font for captcha text)
captcha.size (set size for captcha text)
captcha.opacity (set opacity of captcha text)

**Trace Line Options:**

trace.color (set HTML color code for trace line)
trace.size (set width of trace line)
trace.opacity (set opacity for trace line)

**Decoy Options:**

decoy.color (set Html color for decoy)
decoy.font (set font for decoy text)
decoy.size (set size of decoy text font)
decoy.opacity (set opacity for decoy text.)
## Examples:

See [examples](https://github.com/Shashank3736/captcha-canvas/wiki/Examples) sction in the package [wiki](https://github.com/Shashank3736/captcha-canvas/wiki)

## Need Help:

I am working on a simple guide for this npm package you can check it out [here](https://github.com/Shashank3736/captcha-canvas/wiki). 

Open an [issue](https://github.com/Shashank3736/captcha-canvas/issues) if you need help regarding this module or want to report any bug.

