# captcha-canvas

[![npm](https://img.shields.io/npm/v/captcha-canvas?style=flat-square)](https://www.npmjs.com/package/captcha-canvas)
[![npm-bundle-size](https://img.shields.io/bundlephobia/minzip/captcha-canvas?style=flat-square)](https://bundlephobia.com/result?p=captcha-canvas)
[![npm-downloads](https://img.shields.io/npm/dt/captcha-canvas?style=flat-square)](https://www.npmjs.com/package/captcha-canvas)
[![all-contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

A powerful and customizable captcha generator for Node.js, powered by `skia-canvas`.

![Captcha Example](examples/example.png)

## Features

*   **Highly Customizable**: Control every aspect of the captcha, including text, fonts, colors, backgrounds, and more.
*   **Secure**: Generates complex captchas that are difficult for OCR bots to solve.
*   **Flexible**: Use the simple `createCaptcha` for quick generation or the `CaptchaGenerator` class for more advanced use cases.
*   **Background Support**: Add custom background images to your captchas.
*   **Lightweight**: No bundled dependencies, keeping your project lean.

## Installation

Before installing `captcha-canvas`, you need to install its peer dependency, `skia-canvas`.

```bash
npm install skia-canvas
npm install captcha-canvas
```

## Quick Start

The easiest way to generate a captcha is with the `createCaptcha` function.

```javascript
const fs = require("fs");
const { createCaptchaSync } = require("captcha-canvas");

const { image, text } = createCaptchaSync(100, 300);

fs.writeFileSync("captcha.png", image);
console.log("Captcha text:", text);
```

This will generate a file named `captcha.png` with a random captcha image.

## Advanced Usage

For more control over the captcha generation process, use the `CaptchaGenerator` class.

### Basic Example

```javascript
const fs = require("fs");
const { CaptchaGenerator } = require("captcha-canvas");

const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setCaptcha({ font: "Comic Sans", size: 60, color: "deeppink" })
    .setTrace({ color: "deeppink" })
    .setDecoy({ color: "deeppink" });

const buffer = captcha.generateSync();
fs.writeFileSync("captcha.png", buffer);

console.log("Captcha text:", captcha.text);
```

### Customizing the Captcha

You can customize the captcha text, trace lines, and decoy characters.

#### Setting Dimensions

```javascript
captcha.setDimension(200, 600); // height, width
```

#### Setting a Background Image

```javascript
captcha.setBackground("./path/to/background.png");
```

#### Customizing the Captcha Text

```javascript
captcha.setCaptcha({
    text: "MyCustomText",
    color: "#2D3748",
    font: "Arial",
    size: 70,
    skew: true,
    rotate: 10, // rotation angle in degrees
    opacity: 0.8
});
```

#### Customizing the Trace Line

The trace line is drawn over the captcha text.

```javascript
captcha.setTrace({
    color: "#2D3748",
    size: 5,
    opacity: 0.7
});
```

#### Customizing the Decoy Characters

Decoy characters are random characters added to the background to make the captcha harder to read for bots.

```javascript
captcha.setDecoy({
    color: "#A0AEC0",
    font: "Arial",
    size: 40,
    opacity: 0.5,
    total: 25 // number of decoy characters
});
```

### Asynchronous Generation

If you are using a background image, you should use the asynchronous `generate()` method.

```javascript
const buffer = await captcha.generate();
fs.writeFileSync("captcha.png", buffer);
```

## API Reference

For a full list of options and methods, please see the [API documentation](https://captcha-canvas.js.org/v3/).

## Contributing

Contributions are welcome! Please open an [issue](https://github.com/Shashank3736/captcha-canvas/issues) to report bugs or suggest features.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Shashank3736"><img src="https://avatars2.githubusercontent.com/u/58896906?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shashank</b></sub></a><br /><a href="#projectManagement-Shashank3736" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/TheDeadCraftPT"><img src="https://avatars2.githubusercontent.com/u/46866023?v=4?s=100" width="100px;" alt=""/><br /><sub><b>TheDeadCraftPT</b></sub></a><br /><a href="https://github.com/Shashank3736/captcha-canvas/issues?q=author%3ATheDeadCraftPT" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://ichiidev.xyz"><img src="https://avatars1.githubusercontent.com/u/45918948?v=4?s=100" width="100px;" alt=""/><br /><sub><b>IchiiDev</b></sub></a><br /><a href="https://github.com/Shashank3736/captcha-canvas/issues?q=author%3AIchiiDev" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://t.me/Munn4tic/"><img src="https://avatars1.githubusercontent.com/u/32958839?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ikramullah</b></sub></a><br /><a href="https://github.com/Shashank3736/captcha-canvas/commits?author=skymunn" title="Documentation">📖</a> <a href="https://github.com/Shashank3736/captcha-canvas/commits?author=skymunn" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ryanhex53"><img src="https://avatars.githubusercontent.com/u/360426?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ryanhex53</b></sub></a><br /><a href="https://github.com/Shashank3736/captcha-canvas/commits?author=ryanhex53" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
