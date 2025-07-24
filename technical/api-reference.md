---
title: API Reference
group: Documents
category: Guides
---

# API Reference

This document provides a detailed reference for the `captcha-canvas` API.

## `CaptchaGenerator`

The `CaptchaGenerator` class is the primary interface for creating captchas. It simplifies the process by managing the underlying `Captcha` canvas and its various components.

### `new CaptchaGenerator(options)`

Creates a new `CaptchaGenerator` instance.

- **`options`** `<Object>`
  - **`height`** `<number>` The height of the captcha image. **Default:** `100`.
  - **`width`** `<number>` The width of the captcha image. **Default:** `300`.

### `.text`

- **Returns:** `<string>` The text of the generated captcha.

### `.setDimension(height, width)`

Sets the dimensions of the captcha image.

- **`height`** `<number>` The height of the captcha image.
- **`width`** `<number>` The width of the captcha image.

### `.setBackground(image)`

Sets the background image for the captcha.

- **`image`** `<string> | <Buffer>` The background image for the captcha. This can be a file path, a URL, or a Buffer.

### `.setCaptcha(option)`

Sets the options for the captcha text.

- **`option`** `<SetCaptchaOption> | <SetCaptchaOption[]>` An object or an array of objects containing options for the captcha text.

### `.setTrace(option)`

Sets the options for the trace lines.

- **`option`** `<SetTraceOption>` An object containing options for the trace lines.

### `.setDecoy(option)`

Sets the options for the decoy characters.

- **`option`** `<SetDecoyOption>` An object containing options for the decoy characters.

### `.generate()`

Generates the captcha image asynchronously.

- **Returns:** `<Promise<Buffer>>` A Promise that resolves with the captcha image as a Buffer.

### `.generateSync(option)`

Generates the captcha image synchronously.

- **`option`** `<Object>` (optional)
  - **`background`** `<Image>` An optional background image.
- **Returns:** `<Buffer>` The captcha image as a Buffer.

## `Captcha`

The `Captcha` class provides a lower-level interface for creating captchas, giving you more control over the drawing process.

### `new Captcha(width, height, characters)`

- **`width`** `<number>` The width of the captcha image.
- **`height`** `<number>` The height of the captcha image.
- **`characters`** `<number>` The number of characters in the captcha text.

### `.text`

- **Returns:** `<string>` The text of the captcha.

### `.png`

- **Returns:** `<Buffer> | <Promise<Buffer>>` The captcha image as a PNG Buffer. If the captcha is generated synchronously, it returns a Buffer. If generated asynchronously, it returns a Promise that resolves with a Buffer.

### `.drawImage(image)`

Draws an image on the canvas.

- **`image`** `<Image>` The image to draw on the canvas.

### `.addDecoy(decoyOption)`

Adds decoy characters to the captcha image.

- **`decoyOption`** `<SetDecoyOption>` Options for the decoy characters.

### `.drawTrace(traceOption)`

Draws trace lines on the captcha image.

- **`traceOption`** `<SetTraceOption>` Options for the trace lines.

### `.drawCaptcha(captchaOption)`

Draws the captcha text on the image.

- **`captchaOption`** `<DrawCaptchaOption> | <DrawCaptchaOption[]>` Options for the captcha text.

## Type Definitions

### `SetCaptchaOption`

An object containing options for the captcha text.

- **`characters`** `<number>` The number of characters in the captcha text. **Default:** `6`.
- **`text`** `<string>` The captcha text. If provided, it overrides the `characters` option.
- **`color`** `<string>` The color of the captcha text (hex code). **Default:** `#32cf7e`.
- **`font`** `<string>` The font of the captcha text. **Default:** `Sans`.
- **`skew`** `<boolean>` Whether to skew the captcha text. **Default:** `true`.
- **`colors`** `<string[]>` An array of color hex codes. If provided, each character will have a random color from this array.
- **`rotate`** `<number>` The maximum rotation angle for each character (in degrees). **Default:** `5`.
- **`size`** `<number>` The font size of the captcha text. **Default:** `40`.
- **`opacity`** `<number>` The opacity of the captcha text. **Default:** `0.8`.

### `DrawCaptchaOption`

This is an alias for `SetCaptchaOption` when used with the `Captcha.drawCaptcha` method.

### `SetDecoyOption`

An object containing options for the decoy characters.

- **`color`** `<string>` The color of the decoy characters (hex code). **Default:** `#646566`.
- **`font`** `<string>` The font of the decoy characters. **Default:** `Sans`.
- **`size`** `<number>` The font size of the decoy characters. **Default:** `20`.
- **`opacity`** `<number>` The opacity of the decoy characters. **Default:** `0.8`.
- **`total`** `<number>` The number of decoy characters to add.

### `SetTraceOption`

An object containing options for the trace lines.

- **`color`** `<string>` The color of the trace lines (hex code). **Default:** `#32cf7e`.
- **`size`** `<number>` The width of the trace lines. **Default:** `3`.
- **`opacity`** `<number>` The opacity of the trace lines. **Default:** `1`.
