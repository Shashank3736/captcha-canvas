# captcha-canvas API Documentation

A powerful and highly customizable CAPTCHA generator for Node.js applications, built on top of the fast `skia-canvas` rendering engine.

## Quick Start

```javascript
const { createCaptchaSync, CaptchaGenerator } = require("captcha-canvas");

// Simple generation
const { image, text } = createCaptchaSync(300, 100);

// Advanced generation with fluent API
const captcha = new CaptchaGenerator()
    .setDimension(150, 400)
    .setCaptcha({ characters: 6, size: 60 })
    .setTrace({ color: "#ff0000" });

const buffer = captcha.generateSync();
```

## Core Components

### Classes
- **[CaptchaGenerator](classes/CaptchaGenerator.CaptchaGenerator.html)** - High-level fluent interface for CAPTCHA generation
- **[Captcha](classes/captcha.Captcha.html)** - Low-level canvas manipulation and rendering

### Functions
- **[createCaptcha](functions/extra.createCaptcha.html)** - Async CAPTCHA generation with background support
- **[createCaptchaSync](functions/extra.createCaptchaSync.html)** - Synchronous CAPTCHA generation (faster)
- **[resolveImage](functions/index.resolveImage.html)** - Load and process background images

### Interfaces & Types
- **[SetCaptchaOption](interfaces/constants.SetCaptchaOption.html)** - Configuration options for CAPTCHA text
- **[SetTraceOption](interfaces/constants.SetTraceOption.html)** - Configuration for trace lines
- **[SetDecoyOption](interfaces/constants.SetDecoyOption.html)** - Configuration for decoy characters

## Key Features

- **Dual API Design**: Simple functions for quick use, classes for advanced control
- **Security Features**: Trace lines, decoy characters, and visual distortions
- **Customizable Styling**: Fonts, colors, rotation, skewing, and opacity control
- **Background Support**: Custom background images (async generation only)
- **Multi-styled Text**: Array-based text configuration with different styles per segment
- **TypeScript Ready**: Full type definitions and IntelliSense support

## Installation

```bash
# Install peer dependency first
npm install skia-canvas

# Install captcha-canvas
npm install captcha-canvas
```

## Links

- **[GitHub Repository](https://github.com/Shashank3736/captcha-canvas)** - Source code and issues
- **[NPM Package](https://www.npmjs.com/package/captcha-canvas)** - Package information and downloads
- **[Usage Examples](documents/Technical_Guide.Usage_Examples.html)** - Comprehensive examples and patterns
- **[Technical Guide](documents/Technical_Guide.html)** - Architecture and implementation details

---

*For detailed usage examples, integration patterns, and troubleshooting, see the complete documentation sections below.*