# captcha-canvas

A powerful and highly customizable Node.js library for generating secure CAPTCHA images using the canvas module. Create visually complex captchas that are difficult for OCR bots to solve while remaining accessible to humans.

[![captcha-canvas](https://nodei.co/npm/captcha-canvas.png)](https://npmjs.com/package/captcha-canvas)

![Default Captcha](https://github.com/Shashank3736/captcha-canvas/raw/master/examples/default.png)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FShashank3736%2Fcaptcha-canvas.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FShashank3736%2Fcaptcha-canvas?ref=badge_shield)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Install captcha-canvas](#install-captcha-canvas)
- [Quick Start](#quick-start)
  - [Basic Usage](#basic-usage)
  - [Synchronous Generation](#synchronous-generation)
- [API Reference](#api-reference)
  - [CaptchaGenerator Class](#captchagenerator-class)
    - [Constructor](#constructor)
    - [Methods](#methods)
    - [Properties](#properties)
- [Examples](#examples)
  - [Basic Captcha](#basic-captcha)
  - [Advanced Customization](#advanced-customization)
  - [Segmented Styling](#segmented-styling)
  - [With Background Image](#with-background-image)
  - [Express.js Integration](#expressjs-integration)
- [TypeScript Support](#typescript-support)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
  - [Canvas Installation Issues](#canvas-installation-issues)
  - [Common Issues](#common-issues)
- [Performance Tips](#performance-tips)
- [Version Compatibility](#version-compatibility)
  - [Migration Guide](#migration-guide)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Features

- **🎨 Highly Customizable**: Control every aspect including text, fonts, colors, backgrounds, rotation, skewing, and opacity
- **🔒 Security Focused**: 95% OCR failure rate with trace lines, decoy characters, and visual distortions
- **⚡ Dual API Design**: Simple functions for quick use and class-based approach for advanced customization
- **🖼️ Background Support**: Custom background images for enhanced visual complexity
- **🔄 Async/Sync Support**: Both asynchronous and synchronous generation methods
- **📝 Segmented Text**: Apply different styles to different parts of the captcha text
- **🚀 Performance Optimized**: Lightweight with minimal dependencies
- **📘 TypeScript Support**: Full TypeScript definitions included

## Installation

### Prerequisites

This package requires the `canvas` module as a peer dependency. Install it first:

```bash
npm install canvas
```

### Install captcha-canvas

```bash
npm install captcha-canvas
```

## Quick Start

### Basic Usage

```javascript
const { CaptchaGenerator } = require('captcha-canvas');
const fs = require('fs');

// Create a basic captcha
const captcha = new CaptchaGenerator();
const buffer = await captcha.generate();

// Save to file
fs.writeFileSync('captcha.png', buffer);

// Get the captcha text for verification
console.log('Captcha text:', captcha.text);
```

### Synchronous Generation

```javascript
const { CaptchaGenerator } = require('captcha-canvas');
const fs = require('fs');

const captcha = new CaptchaGenerator();
const buffer = captcha.generateSync();

fs.writeFileSync('captcha.png', buffer);
console.log('Captcha text:', captcha.text);
```

## API Reference

### CaptchaGenerator Class

#### Constructor

```javascript
const captcha = new CaptchaGenerator(options);
```

**Parameters:**
- `options` (optional): Object with `height` and `width` properties

#### Methods

##### `setDimension(height, width)`

Set the canvas dimensions.

```javascript
captcha.setDimension(200, 400);
```

**Parameters:**
- `height` (number): Canvas height in pixels
- `width` (number): Canvas width in pixels

**Returns:** `this` (for method chaining)

##### `setCaptcha(options)`

Configure captcha text appearance. Accepts either a single options object or an array for segmented styling.

```javascript
// Single style
captcha.setCaptcha({
    text: 'HELLO',
    color: 'blue',
    size: 60,
    font: 'Arial'
});

// Segmented styles
captcha.setCaptcha([
    { text: 'HE', color: 'red', size: 60, start: 0, end: 2 },
    { text: 'LLO', color: 'blue', size: 50, start: 2, end: 5 }
]);
```

**Options:**
- `text` (string): Custom text (auto-generated if not provided)
- `characters` (number): Number of characters (default: 6)
- `color` (string): Text color (default: '#32cf7e')
- `colors` (string[]): Array of colors for random selection
- `font` (string): Font family (default: 'Sans')
- `size` (number): Font size in pixels (default: 40)
- `opacity` (number): Text opacity 0-1 (default: 0.8)
- `rotate` (number): Max rotation angle in degrees (default: 5)
- `skew` (boolean): Enable text skewing (default: true)
- `start` (number): Start index for segmented text
- `end` (number): End index for segmented text

**Returns:** `this` (for method chaining)

##### `setTrace(options)`

Configure trace lines that connect characters.

```javascript
captcha.setTrace({
    color: 'red',
    size: 5,
    opacity: 0.8
});
```

**Options:**
- `color` (string): Line color (default: '#32cf7e')
- `size` (number): Line width (default: 3)
- `opacity` (number): Line opacity 0-1 (default: 1)

**Returns:** `this` (for method chaining)

##### `setDecoy(options)`

Configure decoy characters for additional security.

```javascript
captcha.setDecoy({
    color: 'gray',
    font: 'Arial',
    size: 20,
    opacity: 0.5
});
```

**Options:**
- `color` (string): Decoy text color (default: '#646566')
- `font` (string): Font family (default: 'Sans')
- `size` (number): Font size (default: 20)
- `opacity` (number): Text opacity 0-1 (default: 0.8)

**Returns:** `this` (for method chaining)

##### `setBackground(image)`

Set a background image.

```javascript
const fs = require('fs');
const backgroundBuffer = fs.readFileSync('background.jpg');
captcha.setBackground(backgroundBuffer);

// Or use a file path
captcha.setBackground('./path/to/background.jpg');
```

**Parameters:**
- `image` (Buffer | string): Image buffer or file path

**Returns:** `this` (for method chaining)

##### `generate()`

Generate the captcha image asynchronously.

```javascript
const buffer = await captcha.generate();
```

**Returns:** `Promise<Buffer>` - PNG image buffer

##### `generateSync(options)`

Generate the captcha image synchronously.

```javascript
const buffer = captcha.generateSync();

// With pre-loaded background
const { loadImage } = require('canvas');
const backgroundImage = await loadImage('./background.jpg');
const buffer = captcha.generateSync({ background: backgroundImage });
```

**Parameters:**
- `options` (optional): Object with `background` property (pre-loaded Image object)

**Returns:** `Buffer` - PNG image buffer

#### Properties

##### `text`

Get the captcha text for verification.

```javascript
console.log(captcha.text); // e.g., "A3X9K2"
```

**Returns:** `string` - The captcha text

## Examples

### Basic Captcha

```javascript
const { CaptchaGenerator } = require('captcha-canvas');
const fs = require('fs');

const captcha = new CaptchaGenerator()
    .setDimension(150, 400)
    .setCaptcha({ size: 60, color: 'blue' });

fs.writeFileSync('basic.png', captcha.generateSync());
console.log('Text:', captcha.text);
```

### Advanced Customization

```javascript
const { CaptchaGenerator } = require('captcha-canvas');
const fs = require('fs');

const captcha = new CaptchaGenerator({ height: 200, width: 500 })
    .setCaptcha({
        text: 'SECURE',
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
        font: 'Comic Sans MS',
        size: 70,
        rotate: 15,
        skew: true
    })
    .setTrace({
        color: '#ff6b6b',
        size: 4,
        opacity: 0.7
    })
    .setDecoy({
        opacity: 0.4,
        size: 25
    });

fs.writeFileSync('advanced.png', captcha.generateSync());
```

### Segmented Styling

```javascript
const { CaptchaGenerator } = require('captcha-canvas');
const fs = require('fs');

const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setCaptcha([
        { text: 'SEC', color: '#e74c3c', size: 60, start: 0, end: 3 },
        { text: 'URE', color: '#3498db', size: 50, start: 3, end: 6 }
    ]);

fs.writeFileSync('segmented.png', captcha.generateSync());
console.log('Text:', captcha.text); // "SECURE"
```

### With Background Image

```javascript
const { CaptchaGenerator } = require('captcha-canvas');
const fs = require('fs');

async function createCaptchaWithBackground() {
    const backgroundBuffer = fs.readFileSync('./background.jpg');
    
    const captcha = new CaptchaGenerator()
        .setDimension(200, 400)
        .setBackground(backgroundBuffer)
        .setCaptcha({
            color: 'white',
            size: 50,
            opacity: 0.9
        })
        .setTrace({
            color: 'yellow',
            opacity: 0.8
        });

    const buffer = await captcha.generate();
    fs.writeFileSync('with-background.png', buffer);
    console.log('Text:', captcha.text);
}

createCaptchaWithBackground();
```

### Express.js Integration

```javascript
const express = require('express');
const { CaptchaGenerator } = require('captcha-canvas');

const app = express();

app.get('/captcha', async (req, res) => {
    const captcha = new CaptchaGenerator()
        .setDimension(150, 400)
        .setCaptcha({ size: 60 });

    // Store captcha text in session for verification
    req.session.captcha = captcha.text;

    const buffer = await captcha.generate();
    
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
});

app.post('/verify', (req, res) => {
    const userInput = req.body.captcha;
    const sessionCaptcha = req.session.captcha;
    
    if (userInput === sessionCaptcha) {
        res.json({ success: true, message: 'Captcha verified!' });
    } else {
        res.json({ success: false, message: 'Invalid captcha' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## TypeScript Support

This package includes full TypeScript definitions. Import types for better development experience:

```typescript
import { CaptchaGenerator, SetCaptchaOptions, SetTraceOptions, SetDecoyOptions } from 'captcha-canvas';

const options: SetCaptchaOptions = {
    text: 'HELLO',
    color: 'blue',
    size: 60
};

const captcha = new CaptchaGenerator({ height: 200, width: 400 })
    .setCaptcha(options);

const buffer: Buffer = await captcha.generate();
```

## Security Best Practices

1. **Always validate server-side**: Never trust client-side captcha validation
2. **Use session storage**: Store captcha text in server sessions, not client-side
3. **Implement rate limiting**: Prevent brute force attacks
4. **Add expiration**: Set time limits for captcha validity
5. **Use HTTPS**: Protect captcha transmission
6. **Consider accessibility**: Provide audio alternatives for visually impaired users

```javascript
// Example with expiration
app.get('/captcha', async (req, res) => {
    const captcha = new CaptchaGenerator().setCaptcha({ size: 60 });
    
    req.session.captcha = {
        text: captcha.text,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    
    const buffer = await captcha.generate();
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
});

app.post('/verify', (req, res) => {
    const { captcha: userInput } = req.body;
    const sessionCaptcha = req.session.captcha;
    
    if (!sessionCaptcha || Date.now() > sessionCaptcha.expires) {
        return res.json({ success: false, message: 'Captcha expired' });
    }
    
    if (userInput === sessionCaptcha.text) {
        delete req.session.captcha; // Clear after successful verification
        res.json({ success: true, message: 'Verified!' });
    } else {
        res.json({ success: false, message: 'Invalid captcha' });
    }
});
```

## Troubleshooting

### Canvas Installation Issues

If you encounter issues installing the `canvas` dependency:

**On Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**On CentOS/RHEL:**
```bash
sudo yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel
```

**On macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**On Windows:**
- Install Visual Studio Build Tools
- Install Python 2.7
- Use `npm install --global --production windows-build-tools`

### Common Issues

**Issue: "Cannot find module 'canvas'"**
- Solution: Install canvas as a peer dependency: `npm install canvas`

**Issue: Blurry or pixelated output**
- Solution: Increase canvas dimensions and font size proportionally

**Issue: Text appears cut off**
- Solution: Ensure adequate padding by adjusting dimensions or reducing font size

## Performance Tips

1. **Reuse instances**: Create one CaptchaGenerator instance and reuse it
2. **Optimize dimensions**: Larger captchas take more processing time
3. **Limit decoy characters**: High decoy opacity can impact performance
4. **Cache backgrounds**: Pre-load background images when possible
5. **Use synchronous generation**: For better performance when background images aren't needed

## Version Compatibility

- **Node.js**: Requires Node.js 12.x or higher
- **Canvas**: Compatible with canvas 2.x
- **TypeScript**: Full support for TypeScript 4.x+

### Migration Guide

**From v1.x to v2.x:**
- Update import statements to use named exports
- Review method signatures for breaking changes
- Test segmented captcha functionality if used

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- 📖 [Full Documentation](https://captcha-canvas.js.org/v2/)
- 🐛 [Report Issues](https://github.com/Shashank3736/captcha-canvas/issues)
- 💬 [Discussions](https://github.com/Shashank3736/captcha-canvas/discussions)
- ⭐ [Star on GitHub](https://github.com/Shashank3736/captcha-canvas)

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FShashank3736%2Fcaptcha-canvas.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FShashank3736%2Fcaptcha-canvas?ref=badge_large)
