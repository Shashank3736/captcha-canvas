# captcha-canvas
This is an npm package [captcha-canvas](https://npmjs.com/package/captcha-canvas) helps you to make custom captcha of all types. The package uses `canvas` and `canvas-constructor` to create captcha imagas. See installation section to know how to install. 

[![captcha-canvas](https://nodei.co/npm/captcha-canvas.png)](https://npmjs.com/package/captcha-canvas)

#### Captcha Image:

![captcha](./assets/captcha/AFFEEB.png)

### Features

* Highly customisable you can customise every single value use to make this package.
* 95% OCR fails to read this captcha image and throw Error.
* Use class constructor method so you can generate as many frames as many you want by using same values.
* No bundled dependenceris. You need to install them to use the package.
* Support of background images is also possible.
* Captcha adapt all the external options very easily.

## How to use?

```js
const Captcha = require('captcha-canvas');  //require package here
const fs = require('fs'); //require fs module for saving image in a file
const options = {height: 200, width: 600};  //options for captcha image
const captcha = new Captcha(options); //getting captcha constructor
captcha.captchaText; //returns text of the captcha image.
const buffer = captcha.create(); //returns buffer of the captcha image

fs.writeFileSync('./image.png', buffer); //will create image.png file of the captcha
```

# Customisation 
All options are optional.

| Options   | Description | Default Value | Type |
|-----------|:-----------:|:-------------:|:----:|
| options | Set options for the captcha creation | {} | object |
| options.height    | Set height of the captcha image | 200 | number |
| options.width* | Set width of the captcha image | 600 | number |
| options.background | Set background of captcha | null | buffer, link or path to image |
| options.captcha.color | Set color of the captcha text | #32cf7e | color code |
| options.captcha.font | Set font for the captcha text | Comic Sans | canvas font |
| options.captcha.characters** | Length of captcha text | 6 | number |
| options.captcha.text | Text for the captcha image | Random String | String |
| options.captcha.size | Size for the captcha text | 40 | number |
| options.captcha.opacity | Opacity for the text | 1 | number |
| options.trace.color | Set color for the trace line | #32cf7e | color code |
| options.trace.width | Set trace line width. | 3 | number |
| options.trace.opacity | Opacity of the trace line. | 1 | number |
| options.decoy.color | Set color for the background text. | #646566 | color code |
| options.decoy.font | Set font for the decoy text. | Sans | font |
| options.decoy.size | Set font size for the decoy text. | 28 | number |
| options.decoy.opacity | Set opacity for the decoy text | 0.8 | number |

*Note: if you do not set background then create() method returns a png image.

**Note: if you set options.text then this option will not be considered

## Examples:

#### Default:

![Default](./assets/captcha/default.png)
