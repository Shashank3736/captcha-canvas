# Usage Examples

This document provides a collection of usage examples for the `captcha-canvas` library.

## Basic Captcha Generation

This example demonstrates how to generate a simple captcha with default settings.

```javascript
const { CaptchaGenerator } = require("captcha-canvas");
const fs = require("fs");

(async () => {
  const captcha = new CaptchaGenerator();
  const buffer = await captcha.generate();

  fs.writeFileSync("captcha.png", buffer);
  console.log("Captcha generated successfully!");
})();
```

## Customizing the Captcha

This example shows how to customize the captcha's dimensions, text, and appearance.

```javascript
const { CaptchaGenerator } = require("captcha-canvas");
const fs = require("fs");

(async () => {
  const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setCaptcha({ font: "Comic Sans", size: 60, color: "deeppink" })
    .setTrace({ color: "deeppink" })
    .setDecoy({ color: "deeppink" });

  const buffer = await captcha.generate();

  fs.writeFileSync("custom_captcha.png", buffer);
  console.log("Custom captcha generated successfully!");
})();
```

## Using a Background Image

This example demonstrates how to add a background image to the captcha.

```javascript
const { CaptchaGenerator } = require("captcha-canvas");
const fs = require("fs");

(async () => {
  const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setBackground("path/to/your/background.png");

  const buffer = await captcha.generate();

  fs.writeFileSync("background_captcha.png", buffer);
  console.log("Captcha with background generated successfully!");
})();
```

## Synchronous Generation

This example shows how to generate a captcha synchronously.

```javascript
const { CaptchaGenerator, resolveImage } = require("captcha-canvas");
const fs = require("fs");

(async () => {
  const backgroundImage = await resolveImage("path/to/your/background.png");

  const captcha = new CaptchaGenerator();
  const buffer = captcha.generateSync({ background: backgroundImage });

  fs.writeFileSync("sync_captcha.png", buffer);
  console.log("Synchronous captcha generated successfully!");
})();
```
