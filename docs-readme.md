# captcha-canvas API Documentation

Welcome to the comprehensive API documentation for **captcha-canvas** - a powerful Node.js library for generating secure, customizable CAPTCHA images.

## 📦 Installation

```bash
# Install the canvas peer dependency first
npm install canvas

# Install captcha-canvas
npm install captcha-canvas
```

## 🎯 Getting Started

### Basic Usage

```typescript
import { CaptchaGenerator } from 'captcha-canvas';

// Create a simple captcha
const captcha = new CaptchaGenerator()
  .setDimension(150, 400)
  .setCaptcha({ size: 60, color: 'blue' });

const buffer = await captcha.generate();
console.log('Captcha text:', captcha.text);
```

### Advanced Configuration

```typescript
import { CaptchaGenerator } from 'captcha-canvas';

// Create a highly customized captcha
const captcha = new CaptchaGenerator({ height: 200, width: 500 })
  .setCaptcha({
    text: 'SECURE',
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    font: 'Arial',
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

const buffer = await captcha.generate();
```

## 🎨 Key Features

### 🔧 Highly Customizable
- **Text Styling**: Control font, size, color, rotation, and skewing
- **Visual Effects**: Add trace lines and decoy characters
- **Background Images**: Support for custom background images
- **Segmented Text**: Apply different styles to different parts of the text

### 🛡️ Security Focused
- **OCR Resistance**: 95% failure rate against automated OCR systems
- **Visual Distortions**: Multiple layers of visual complexity
- **Random Generation**: Cryptographically secure random text generation

### ⚡ Developer Friendly
- **Dual API**: Simple functions and advanced class-based approach
- **TypeScript Support**: Full type definitions included
- **Async/Sync**: Both asynchronous and synchronous generation methods
- **Method Chaining**: Fluent interface for easy configuration

## 📚 Examples

### Segmented Styling
Apply different styles to different parts of your captcha text:

```typescript
const captcha = new CaptchaGenerator()
  .setDimension(150, 450)
  .setCaptcha([
    { text: 'SEC', color: '#e74c3c', size: 60, start: 0, end: 3 },
    { text: 'URE', color: '#3498db', size: 50, start: 3, end: 6 }
  ]);

const buffer = await captcha.generate();
console.log('Text:', captcha.text); // "SECURE"
```

### With Background Image
Add visual complexity with background images:

```typescript
import fs from 'fs';

const backgroundBuffer = fs.readFileSync('./background.jpg');

const captcha = new CaptchaGenerator()
  .setDimension(200, 400)
  .setBackground(backgroundBuffer)
  .setCaptcha({
    color: 'white',
    size: 50,
    opacity: 0.9
  });

const buffer = await captcha.generate();
```

### Express.js Integration
Perfect for web applications:

```typescript
import express from 'express';
import { CaptchaGenerator } from 'captcha-canvas';

const app = express();

app.get('/captcha', async (req, res) => {
  const captcha = new CaptchaGenerator()
    .setDimension(150, 400)
    .setCaptcha({ size: 60 });

  // Store in session for verification
  req.session.captcha = captcha.text;

  const buffer = await captcha.generate();
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});
```

## 🔍 API Reference

### Core Classes
- **[CaptchaGenerator](classes/src_main.default.html)** - Main class for captcha generation with fluent API

### Configuration Interfaces
- **[SetCaptchaOptions](interfaces/src_constants.SetCaptchaOptions.html)** - Text styling and content options
- **[SetTraceOptions](interfaces/src_constants.SetTraceOptions.html)** - Trace line configuration
- **[SetDecoyOptions](interfaces/src_constants.SetDecoyOptions.html)** - Decoy character settings
- **[SetDimensionOption](interfaces/src_constants.SetDimensionOption.html)** - Canvas dimension settings

### Utility Functions
- **[merge](functions/src_util.merge.html)** - Object merging utility

### Default Values
- **[defaultCaptchaOptions](variables/src_constants.defaultCaptchaOptions.html)** - Default captcha configuration
- **[defaultTraceOptions](variables/src_constants.defaultTraceOptions.html)** - Default trace line configuration
- **[defaultDecoyOptions](variables/src_constants.defaultDecoyOptions.html)** - Default decoy character configuration

## 🛡️ Security Best Practices

1. **Server-side Validation**: Always validate captcha on the server
2. **Session Storage**: Store captcha text in secure server sessions
3. **Rate Limiting**: Implement rate limiting to prevent brute force attacks
4. **Expiration**: Set time limits for captcha validity
5. **HTTPS**: Always use HTTPS in production

## 🔗 External Resources

- **[GitHub Repository](https://github.com/Shashank3736/captcha-canvas)** - Source code and issues
- **[NPM Package](https://www.npmjs.com/package/captcha-canvas)** - Package information
- **[Canvas Documentation](https://github.com/Automattic/node-canvas)** - Underlying canvas library

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](https://github.com/Shashank3736/captcha-canvas/blob/master/LICENSE) file for details.

---

*Generated with ❤️ using [TypeDoc](https://typedoc.org/)*