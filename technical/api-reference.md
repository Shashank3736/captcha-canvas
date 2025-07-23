# API Reference

This document provides a detailed reference for the `captcha-canvas` API.

## `CaptchaGenerator`

The `CaptchaGenerator` class is the primary interface for creating captchas. It simplifies the process by managing the underlying `Captcha` canvas and its various components.

### `new CaptchaGenerator(options)`

- **`options`** `<Object>`
  - **`height`** `<number>` The height of the captcha image. **Default:** `100`.
  - **`width`** `<number>` The width of the captcha image. **Default:** `300`.

Creates a new `CaptchaGenerator` instance.

### `.text`

- **Returns:** `<string>` The text of the generated captcha.

### `.setDimension(height, width)`

- **`height`** `<number>` The height of the captcha image.
- **`width`** `<number>` The width of the captcha image.

Sets the dimensions of the captcha image.

### `.setBackground(image)`

- **`image`** `<string> | <Buffer>` The background image for the captcha. This can be a file path, a URL, or a Buffer.

### `.setCaptcha(option)`

- **`option`** `<SetCaptchaOption>` An object containing options for the captcha text.

### `.setTrace(option)`

- **`option`** `<SetTraceOption>` An object containing options for the trace lines.

### `.setDecoy(option)`

- **`option`** `<SetDecoyOption>` An object containing options for the decoy characters.

### `.generate()`

- **Returns:** `<Promise<Buffer>>` A Promise that resolves with the captcha image as a Buffer.

Generates the captcha image asynchronously.

### `.generateSync(option)`

- **`option`** `<Object>`
  - **`background`** `<Image>` An optional background image.
- **Returns:** `<Buffer>` The captcha image as a Buffer.

Generates the captcha image synchronously.

## `Captcha`

The `Captcha` class provides a lower-level interface for creating captchas. It gives you more control over the drawing process.

### `new Captcha(width, height, characters)`

- **`width`** `<number>` The width of the captcha image.
- **`height`** `<number>` The height of the captcha image.
- **`characters`** `<number>` The number of characters in the captcha text.

### `.text`

- **Returns:** `<string>` The text of the captcha.

### `.png`

- **Returns:** `<Buffer> | <Promise<Buffer>>` The captcha image as a PNG Buffer.

### `.drawImage(image)`

- **`image`** `<Image>` The image to draw on the canvas.

### `.addDecoy(decoyOption)`

- **`decoyOption`** `<SetDecoyOption>` Options for the decoy characters.

### `.drawTrace(traceOption)`

- **`traceOption`** `<SetTraceOption>` Options for the trace lines.

### `.drawCaptcha(captchaOption)`

- **`captchaOption`** `<DrawCaptchaOption>` Options for the captcha text.
