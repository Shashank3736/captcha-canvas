---
title: Usage Examples
group: Documents
category: Guides
---

# Usage Examples

This document provides a collection of usage examples for the `captcha-canvas` library. These examples cover basic to advanced use cases to help you get started quickly.

## Basic Captcha Generation

This example demonstrates how to generate a simple captcha with default settings. The `CaptchaGenerator` class handles all the complexities, making it easy to create a captcha in just a few lines of code.

```javascript
import { CaptchaGenerator } from "captcha-canvas";
import { writeFileSync } from "fs";

(async () => {
  const captcha = new CaptchaGenerator();
  const buffer = await captcha.generate();

  writeFileSync("captcha.png", buffer);
  console.log("Captcha generated successfully!");
})();
```

## Customizing the Captcha

This example shows how to customize the captcha's dimensions, text, and appearance. You can chain multiple methods to configure the captcha to your specific needs.

```javascript
import { CaptchaGenerator } from "captcha-canvas";
import { writeFileSync } from "fs";

(async () => {
  const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setCaptcha({ font: "Comic Sans", size: 60, color: "deeppink" })
    .setTrace({ color: "deeppink" })
    .setDecoy({ color: "deeppink" });

  const buffer = await captcha.generate();

  writeFileSync("custom_captcha.png", buffer);
  console.log("Custom captcha generated successfully!");
})();
```

## Using a Background Image

This example demonstrates how to add a background image to the captcha. The background can be a local file path or a URL.

```javascript
import { CaptchaGenerator } from "captcha-canvas";
import { writeFileSync } from "fs";

(async () => {
  const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setBackground("path/to/your/background.png");

  const buffer = await captcha.generate();

  writeFileSync("background_captcha.png", buffer);
  console.log("Captcha with background generated successfully!");
})();
```

## Synchronous Generation

This example shows how to generate a captcha synchronously. This is useful in scenarios where asynchronous operations are not required.

```javascript
import { CaptchaGenerator } from "captcha-canvas";
import { writeFileSync } from "fs";

const captcha = new CaptchaGenerator();
const buffer = captcha.generateSync();

writeFileSync("sync_captcha.png", buffer);
console.log("Synchronous captcha generated successfully!");
```

## Advanced Usage with `Captcha`

For more granular control, you can use the lower-level `Captcha` class. This example demonstrates how to build a captcha by manually drawing the components.

```javascript
import { Captcha } from "captcha-canvas";
import { writeFileSync } from "fs";

const captcha = new Captcha(300, 100, 6);
captcha
  .addDecoy()
  .drawCaptcha()
  .drawTrace();

const buffer = captcha.png;

writeFileSync("advanced_captcha.png", buffer);
console.log("Advanced captcha generated successfully!");
