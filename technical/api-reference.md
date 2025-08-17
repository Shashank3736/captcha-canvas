---
title: API Reference
group: Documents
category: Guides
---

# Enhanced API Reference

This document provides a comprehensive overview of the captcha-canvas API with detailed explanations and practical examples.

## Table of Contents

- [Quick Start](#quick-start)
- [Simple Function API](#simple-function-api)
- [Advanced Class API](#advanced-class-api)
- [Configuration Interfaces](#configuration-interfaces)
- [Utility Functions](#utility-functions)
- [Best Practices](#best-practices)

## Quick Start

### Installation
```bash
npm install captcha-canvas
```

### Basic Usage
```typescript
import { createCaptcha } from 'captcha-canvas';
import fs from 'fs';

// Generate a simple CAPTCHA
const { image, text } = createCaptcha(300, 100);
const buffer = await image;

fs.writeFileSync('captcha.png', buffer);
console.log('Solution:', text);
```

## Simple Function API

### `createCaptcha(width, height, options?)`

Creates a CAPTCHA asynchronously with automatic security features.

**Parameters:**
- `width: number` - Image width in pixels
- `height: number` - Image height in pixels  
- `options?: CreateCaptchaOptions` - Optional configuration

**Returns:** `CaptchaValue` - Object with `image: Promise<Buffer>` and `text: string`

**Examples:**

```typescript
// Basic generation
const { image, text } = createCaptcha(300, 100);

// Custom text and styling
const { image, text } = createCaptcha(400, 150, {
  captcha: {
    text: 'HELLO',
    size: 60,
    colors: ['#e74c3c', '#3498db']
  },
  trace: { color: '#95a5a6', size: 4 },
  decoy: { total: 30, opacity: 0.3 }
});

// With background image
import { resolveImage } from 'captcha-canvas';
const background = await resolveImage('./background.jpg');
const { image, text } = createCaptcha(300, 100, { background });
```

### `createCaptchaSync(width, height, options?)`

Creates a CAPTCHA synchronously without async/await.

**Parameters:**
- `width: number` - Image width in pixels
- `height: number` - Image height in pixels
- `options?: CreateCaptchaOptions` - Optional configuration

**Returns:** `CaptchaValueSync` - Object with `image: Buffer` and `text: string`

**Examples:**

```typescript
// Synchronous generation
const { image, text } = createCaptchaSync(300, 100);
fs.writeFileSync('captcha.png', image);

// With pre-loaded background
const background = await resolveImage('./background.jpg');
const { image, text } = createCaptchaSync(300, 100, { background });
```

## Advanced Class API

### `CaptchaGenerator`

Advanced CAPTCHA generator with fluent API for maximum customization.

#### Constructor

```typescript
new CaptchaGenerator(options?: { height?: number, width?: number })
```

**Examples:**
```typescript
const captcha = new CaptchaGenerator(); // 300x100 default
const captcha = new CaptchaGenerator({ width: 400, height: 150 });
```

#### Methods

##### `setDimension(height, width)`

Sets canvas dimensions.

```typescript
const captcha = new CaptchaGenerator()
  .setDimension(200, 500);
```

##### `setBackground(image)`

Sets background image from path, URL, or Buffer.

```typescript
const captcha = new CaptchaGenerator()
  .setBackground('./noise-pattern.jpg')
  .setBackground('https://example.com/bg.png')
  .setBackground(imageBuffer);
```

##### `setCaptcha(option)`

Configures text appearance and content.

```typescript
// Basic text
const captcha = new CaptchaGenerator()
  .setCaptcha({
    text: 'SECURE',
    size: 60,
    color: '#2c3e50'
  });

// Multi-color text
const captcha = new CaptchaGenerator()
  .setCaptcha({
    text: 'RAINBOW',
    colors: ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db']
  });

// Multi-styled segments
const captcha = new CaptchaGenerator()
  .setCaptcha([
    { text: 'SEC', size: 50, color: '#e74c3c' },
    { text: 'URE', size: 45, color: '#27ae60' }
  ]);

// Random generation
const captcha = new CaptchaGenerator()
  .setCaptcha({ characters: 8, size: 40 });
```

##### `setTrace(option)`

Configures connecting trace lines.

```typescript
const captcha = new CaptchaGenerator()
  .setTrace({
    color: '#95a5a6',
    size: 3,
    opacity: 0.8
  });
```

##### `setDecoy(option)`

Configures decoy characters for security.

```typescript
const captcha = new CaptchaGenerator()
  .setDecoy({
    total: 40,
    color: '#7f8c8d',
    size: 18,
    opacity: 0.3
  });
```

##### `generate()`

Generates the final image asynchronously.

```typescript
const buffer = await captcha.generate();
fs.writeFileSync('captcha.png', buffer);
console.log('Text:', captcha.text);
```

##### `generateSync(options?)`

Generates the image synchronously.

```typescript
const buffer = captcha.generateSync();
// With background
const buffer = captcha.generateSync({ background: preloadedImage });
```

#### Properties

##### `text`

Gets the current CAPTCHA solution text.

```typescript
const captcha = new CaptchaGenerator()
  .setCaptcha({ text: 'HELLO' });
console.log(captcha.text); // "HELLO"
```

### `Captcha`

Low-level canvas operations for fine-grained control.

#### Constructor

```typescript
new Captcha(width?: number, height?: number, characters?: number)
```

#### Methods

##### `drawImage(image)`

Draws background image.

```typescript
const captcha = new Captcha(300, 100);
captcha.drawImage(backgroundImage);
```

##### `addDecoy(options?)`

Adds decoy characters.

```typescript
captcha.addDecoy({
  total: 25,
  opacity: 0.3,
  color: '#95a5a6'
});
```

##### `drawCaptcha(options?)`

Draws main CAPTCHA text.

```typescript
captcha.drawCaptcha({
  text: 'HELLO',
  size: 40,
  rotate: 15,
  skew: true
});
```

##### `drawTrace(options?)`

Draws connecting trace lines.

```typescript
captcha.drawTrace({
  color: '#95a5a6',
  size: 3,
  opacity: 0.8
});
```

#### Properties

##### `text`

Gets the CAPTCHA solution text.

##### `png`

Gets the image as PNG buffer (Promise in async mode, Buffer in sync mode).

```typescript
// Async mode (default)
const buffer = await captcha.png;

// Sync mode
captcha.async = false;
const buffer = captcha.png as Buffer;
```

## Configuration Interfaces

### `SetCaptchaOption`

Configuration for CAPTCHA text in CaptchaGenerator.

```typescript
interface SetCaptchaOption {
  characters?: number;    // Random character count
  text?: string;         // Specific text
  color?: string;        // Text color
  font?: string;         // Font family
  skew?: boolean;        // Apply skewing
  colors?: string[];     // Multi-color array
  rotate?: number;       // Rotation range (degrees)
  size?: number;         // Font size (pixels)
  opacity?: number;      // Text opacity (0-1)
}
```

### `SetTraceOption`

Configuration for trace lines.

```typescript
interface SetTraceOption {
  color?: string;        // Line color
  size?: number;         // Line width (pixels)
  opacity?: number;      // Line opacity (0-1)
}
```

### `SetDecoyOption`

Configuration for decoy characters.

```typescript
interface SetDecoyOption {
  color?: string;        // Decoy color
  font?: string;         // Font family
  size?: number;         // Font size (pixels)
  opacity?: number;      // Decoy opacity (0-1)
  total?: number;        // Number of decoys
}
```

### `CreateCaptchaOptions`

Configuration for simple function API.

```typescript
interface CreateCaptchaOptions {
  captcha?: SetCaptchaOption | SetCaptchaOption[];
  trace?: SetTraceOption;
  decoy?: SetDecoyOption;
  background?: Image;
}
```

## Utility Functions

### `resolveImage(source)`

Loads images from various sources (re-exported from skia-canvas).

```typescript
import { resolveImage } from 'captcha-canvas';

const image = await resolveImage('./background.jpg');
const image = await resolveImage('https://example.com/bg.png');
const image = await resolveImage(buffer);
```

## Best Practices

### Security Recommendations

1. **Use Multiple Security Features**
   ```typescript
   const captcha = new CaptchaGenerator()
     .setCaptcha({ characters: 6, rotate: 15, skew: true })
     .setTrace({ size: 3, opacity: 0.8 })
     .setDecoy({ total: 30, opacity: 0.3 });
   ```

2. **Vary CAPTCHA Appearance**
   ```typescript
   const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12'];
   const captcha = new CaptchaGenerator()
     .setCaptcha({ 
       characters: Math.floor(Math.random() * 3) + 5, // 5-7 chars
       colors: colors,
       size: Math.floor(Math.random() * 20) + 40 // 40-60px
     });
   ```

3. **Background Images for Enhanced Security**
   ```typescript
   const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg'];
   const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
   
   const captcha = new CaptchaGenerator()
     .setBackground(randomBg)
     .setCaptcha({ opacity: 0.9 }); // Ensure visibility
   ```

### Performance Optimization

1. **Use Sync Mode When Possible**
   ```typescript
   // For batch generation or non-async contexts
   const { image, text } = createCaptchaSync(300, 100);
   ```

2. **Pre-load Background Images**
   ```typescript
   const backgroundCache = new Map();
   const bg = backgroundCache.get('noise') || 
              await resolveImage('./noise.jpg');
   backgroundCache.set('noise', bg);
   ```

3. **Reuse Generator Instances**
   ```typescript
   const generator = new CaptchaGenerator({ width: 300, height: 100 });
   
   // Generate multiple CAPTCHAs
   for (let i = 0; i < 10; i++) {
     generator.setCaptcha({ characters: 6 });
     const buffer = await generator.generate();
     // Process buffer...
   }
   ```

### Accessibility Considerations

1. **Provide Audio Alternative**
   ```typescript
   // Generate simple text for audio conversion
   const { image, text } = createCaptcha(300, 100, {
     captcha: { 
       characters: 5,  // Shorter for audio
       rotate: 0,      // No rotation for clarity
       skew: false     // No skewing
     }
   });
   ```

2. **High Contrast Mode**
   ```typescript
   const captcha = new CaptchaGenerator()
     .setCaptcha({
       color: '#000000',
       size: 50,
       rotate: 5  // Minimal rotation
     })
     .setTrace({ opacity: 0.3 }); // Subtle trace
   ```

3. **Larger Sizes for Better Readability**
   ```typescript
   const captcha = new CaptchaGenerator({ width: 400, height: 150 })
     .setCaptcha({ size: 60 });
   ```