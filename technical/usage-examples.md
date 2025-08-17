---
title: Usage Examples
group: Documents
category: Guides
---

# Usage Examples

This document provides practical examples of using captcha-canvas in various real-world scenarios.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Web Integration](#web-integration)
- [Advanced Customization](#advanced-customization)
- [Synchronous Generation](#synchronous-generation)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Mobile-Friendly CAPTCHAs](#mobile-friendly-captchas)

## Basic Usage

### Simple CAPTCHA Generation

```javascript
const { createCaptcha } = require("captcha-canvas");
const fs = require("fs");

async function generateSimpleCaptcha() {
    const { image, text } = createCaptcha(300, 100);
    const buffer = await image;
    
    fs.writeFileSync("captcha.png", buffer);
    console.log("CAPTCHA text:", text);
}

generateSimpleCaptcha();
```

### Using CaptchaGenerator Class

```javascript
const { CaptchaGenerator } = require("captcha-canvas");
const fs = require("fs");

async function generateAdvancedCaptcha() {
    const captcha = new CaptchaGenerator()
        .setDimension(400, 150)
        .setCaptcha({
            text: "SECURE",
            size: 60,
            color: "#2c3e50"
        })
        .setTrace({
            color: "#95a5a6",
            size: 4
        });
    
    const buffer = await captcha.generate();
    fs.writeFileSync("advanced-captcha.png", buffer);
    console.log("CAPTCHA text:", captcha.text);
}

generateAdvancedCaptcha();
```

### TypeScript Usage

```typescript
import { CaptchaGenerator, createCaptcha, SetCaptchaOption } from 'captcha-canvas';
import fs from 'fs';

async function typescriptExample(): Promise<void> {
    // Using the simple function API
    const { image, text } = createCaptcha(300, 100, {
        captcha: { characters: 6, size: 40 },
        trace: { color: '#95a5a6' }
    });
    
    const buffer = await image;
    fs.writeFileSync('simple-captcha.png', buffer);
    
    // Using the class API with type safety
    const config: SetCaptchaOption = {
        text: 'HELLO',
        size: 50,
        colors: ['#e74c3c', '#3498db']
    };
    
    const captcha = new CaptchaGenerator({ width: 350, height: 120 })
        .setCaptcha(config);
    
    const classBuffer = await captcha.generate();
    fs.writeFileSync('class-captcha.png', classBuffer);
    
    console.log('Generated text:', captcha.text);
}
```

## Web Integration

### Express.js Server with Session Management

```javascript
const express = require("express");
const session = require("express-session");
const { createCaptcha } = require("captcha-canvas");

const app = express();

app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 } // 5 minutes
}));

app.use(express.json());
app.use(express.static('public'));

// Generate CAPTCHA endpoint
app.get("/captcha", async (req, res) => {
    try {
        const { image, text } = createCaptcha(300, 100, {
            captcha: { 
                characters: 6,
                size: 40,
                rotate: 15
            },
            trace: { opacity: 0.8, size: 3 },
            decoy: { total: 25, opacity: 0.3 }
        });
        
        // Store solution in session with timestamp
        req.session.captcha = {
            solution: text,
            timestamp: Date.now()
        };
        
        const buffer = await image;
        res.type("png").send(buffer);
    } catch (error) {
        console.error('CAPTCHA generation error:', error);
        res.status(500).json({ error: 'Failed to generate CAPTCHA' });
    }
});

// Verify CAPTCHA endpoint
app.post("/verify", (req, res) => {
    const { captcha } = req.body;
    const sessionData = req.session.captcha;
    
    // Check if CAPTCHA exists and hasn't expired (5 minutes)
    if (!sessionData || Date.now() - sessionData.timestamp > 300000) {
        return res.json({ 
            success: false, 
            message: "CAPTCHA expired. Please refresh." 
        });
    }
    
    if (captcha && captcha.toUpperCase() === sessionData.solution) {
        res.json({ success: true, message: "CAPTCHA verified!" });
    } else {
        res.json({ success: false, message: "Invalid CAPTCHA" });
    }
    
    // Clear session data
    delete req.session.captcha;
});

// Refresh CAPTCHA endpoint
app.post("/captcha/refresh", async (req, res) => {
    try {
        const { image, text } = createCaptcha(300, 100);
        
        req.session.captcha = {
            solution: text,
            timestamp: Date.now()
        };
        
        const buffer = await image;
        res.type("png").send(buffer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh CAPTCHA' });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

### Next.js API Routes

```javascript
// pages/api/captcha.js
import { createCaptcha } from 'captcha-canvas';
import { withIronSession } from 'next-iron-session';

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { image, text } = createCaptcha(300, 100, {
                captcha: { characters: 6 },
                decoy: { total: 30, opacity: 0.3 }
            });
            
            req.session.set('captcha', {
                solution: text,
                timestamp: Date.now()
            });
            await req.session.save();
            
            const buffer = await image;
            res.setHeader('Content-Type', 'image/png');
            res.send(buffer);
        } catch (error) {
            res.status(500).json({ error: 'CAPTCHA generation failed' });
        }
    } else if (req.method === 'POST') {
        const { captcha } = req.body;
        const sessionData = req.session.get('captcha');
        
        if (!sessionData || Date.now() - sessionData.timestamp > 300000) {
            return res.json({ success: false, message: 'CAPTCHA expired' });
        }
        
        const isValid = captcha?.toUpperCase() === sessionData.solution;
        
        if (isValid) {
            req.session.destroy();
        }
        
        res.json({ 
            success: isValid, 
            message: isValid ? 'Verified' : 'Invalid CAPTCHA' 
        });
    }
}

export default withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'captcha-session'
});
```

## Advanced Customization

### Multi-Color Rainbow Text

```javascript
const { CaptchaGenerator } = require("captcha-canvas");

async function rainbowCaptcha() {
    const captcha = new CaptchaGenerator()
        .setDimension(450, 150)
        .setCaptcha({
            text: "RAINBOW",
            size: 55,
            colors: [
                "#e74c3c", // Red
                "#f39c12", // Orange  
                "#f1c40f", // Yellow
                "#27ae60", // Green
                "#3498db", // Blue
                "#9b59b6", // Purple
                "#e91e63"  // Pink
            ],
            rotate: 10,
            skew: true
        })
        .setTrace({ 
            color: "#34495e", 
            size: 3, 
            opacity: 0.7 
        });
    
    return {
        buffer: await captcha.generate(),
        text: captcha.text
    };
}
```

### Multi-Styled Text Segments

```javascript
const { CaptchaGenerator } = require("captcha-canvas");

async function multiStyledCaptcha() {
    const captcha = new CaptchaGenerator({ width: 500, height: 150 })
        .setCaptcha([
            { 
                text: "SEC", 
                size: 60, 
                color: "#e74c3c", 
                font: "Arial",
                rotate: 15 
            },
            { 
                text: "URE", 
                size: 50, 
                color: "#27ae60", 
                font: "Times",
                skew: true 
            },
            { 
                text: "123", 
                size: 45, 
                color: "#3498db", 
                font: "Courier",
                rotate: -10 
            }
        ])
        .setTrace({ color: "#95a5a6", size: 4 });
    
    return await captcha.generate();
}
```

### Background Image with Noise Pattern

```javascript
const { CaptchaGenerator, resolveImage } = require("captcha-canvas");

async function noisyBackgroundCaptcha() {
    // Create or load a noise pattern background
    const background = await resolveImage("./assets/noise-pattern.jpg");
    
    const captcha = new CaptchaGenerator()
        .setDimension(400, 150)
        .setBackground(background)
        .setCaptcha({
            text: "SECURE",
            size: 60,
            opacity: 0.95,  // High opacity to stand out
            colors: ["#ffffff", "#f8f9fa"], // Light colors for dark background
            rotate: 12,
            skew: true
        })
        .setTrace({ 
            color: "#ecf0f1", 
            size: 3, 
            opacity: 0.8 
        })
        .setDecoy({ 
            total: 40, 
            opacity: 0.2, 
            color: "#bdc3c7" 
        });
    
    return await captcha.generate();
}
```

### High Security Configuration

```javascript
const { CaptchaGenerator } = require("captcha-canvas");

async function fortKnoxCaptcha() {
    const captcha = new CaptchaGenerator({ width: 500, height: 200 })
        .setCaptcha({
            characters: 8,  // Longer text
            size: 55,
            rotate: 25,     // More rotation
            skew: true,
            colors: [
                "#2c3e50", "#e74c3c", "#27ae60", 
                "#f39c12", "#8e44ad", "#16a085"
            ],
            opacity: 0.9
        })
        .setTrace({
            size: 6,        // Thicker trace lines
            opacity: 0.9,
            color: "#34495e"
        })
        .setDecoy({
            total: 80,      // Many decoys
            opacity: 0.4,
            size: 25,
            color: "#7f8c8d"
        });
    
    return {
        buffer: await captcha.generate(),
        solution: captcha.text,
        difficulty: "maximum"
    };
}
```

## Synchronous Generation

### Batch Processing for Pre-generation

```javascript
const { createCaptchaSync } = require("captcha-canvas");
const fs = require("fs");
const path = require("path");

function generateCaptchaBatch(count, outputDir = "./captchas") {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const captchas = [];
    const startTime = Date.now();
    
    for (let i = 0; i < count; i++) {
        const { image, text } = createCaptchaSync(300, 100, {
            captcha: { 
                characters: 6,
                size: 40,
                rotate: 15
            },
            decoy: { total: 25, opacity: 0.3 },
            trace: { size: 3, opacity: 0.8 }
        });
        
        const filename = `captcha-${Date.now()}-${i}.png`;
        const filepath = path.join(outputDir, filename);
        
        fs.writeFileSync(filepath, image);
        
        captchas.push({
            id: i + 1,
            filename,
            filepath,
            solution: text,
            timestamp: Date.now()
        });
        
        // Progress logging
        if ((i + 1) % 10 === 0) {
            console.log(`Generated ${i + 1}/${count} CAPTCHAs`);
        }
    }
    
    const duration = Date.now() - startTime;
    console.log(`Batch complete: ${count} CAPTCHAs in ${duration}ms`);
    
    // Save metadata
    const metadata = {
        count,
        duration,
        averageTime: duration / count,
        captchas
    };
    
    fs.writeFileSync(
        path.join(outputDir, 'metadata.json'), 
        JSON.stringify(metadata, null, 2)
    );
    
    return metadata;
}

// Generate 100 CAPTCHAs
const batch = generateCaptchaBatch(100);
console.log(`Average generation time: ${batch.averageTime.toFixed(2)}ms`);
```

## Error Handling

### Comprehensive Error Handling

```javascript
const { CaptchaGenerator, createCaptchaSync } = require("captcha-canvas");

class CaptchaService {
    constructor() {
        this.fallbackEnabled = true;
        this.retryAttempts = 3;
    }
    
    async generateRobustCaptcha(config = {}) {
        const attempts = [];
        
        // Primary generation attempt
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const captcha = new CaptchaGenerator(config.dimensions)
                    .setCaptcha(config.captcha || { characters: 6 })
                    .setTrace(config.trace || {})
                    .setDecoy(config.decoy || {});
                
                if (config.background) {
                    captcha.setBackground(config.background);
                }
                
                const buffer = await captcha.generate();
                
                return {
                    success: true,
                    buffer,
                    text: captcha.text,
                    method: 'primary',
                    attempt
                };
            } catch (error) {
                attempts.push({
                    attempt,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                // Wait before retry (exponential backoff)
                if (attempt < this.retryAttempts) {
                    await new Promise(resolve => 
                        setTimeout(resolve, Math.pow(2, attempt) * 100)
                    );
                }
            }
        }
        
        // Fallback to synchronous generation
        if (this.fallbackEnabled) {
            try {
                console.log('Falling back to synchronous generation');
                
                const { image, text } = createCaptchaSync(
                    config.dimensions?.width || 300,
                    config.dimensions?.height || 100,
                    {
                        captcha: config.captcha || { characters: 6 },
                        trace: config.trace || {},
                        decoy: config.decoy || {}
                    }
                );
                
                return {
                    success: true,
                    buffer: image,
                    text,
                    method: 'fallback',
                    attempts
                };
            } catch (fallbackError) {
                attempts.push({
                    method: 'fallback',
                    error: fallbackError.message,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        // Complete failure
        return {
            success: false,
            error: 'All generation attempts failed',
            attempts
        };
    }
}

// Usage
const service = new CaptchaService();

async function handleCaptchaRequest(req, res) {
    try {
        const result = await service.generateRobustCaptcha({
            dimensions: { width: 300, height: 100 },
            captcha: { characters: 6, size: 40 },
            trace: { size: 3 },
            decoy: { total: 25, opacity: 0.3 }
        });
        
        if (result.success) {
            req.session.captcha = result.text;
            res.type('png').send(result.buffer);
        } else {
            console.error('CAPTCHA generation failed:', result);
            res.status(500).json({ 
                error: 'CAPTCHA generation failed',
                details: result.attempts 
            });
        }
    } catch (error) {
        console.error('CAPTCHA request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
```

## Testing

### Comprehensive Test Suite

```javascript
const { createCaptcha, createCaptchaSync, CaptchaGenerator } = require("captcha-canvas");

describe("CAPTCHA Generation Tests", () => {
    describe("Basic Functionality", () => {
        test("should generate CAPTCHA with correct format", async () => {
            const { image, text } = createCaptcha(300, 100);
            const buffer = await image;
            
            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.length).toBeGreaterThan(0);
            expect(text).toMatch(/^[A-F0-9]+$/);
            expect(text.length).toBeGreaterThan(0);
        });
        
        test("should generate synchronous CAPTCHA", () => {
            const { image, text } = createCaptchaSync(300, 100);
            
            expect(image).toBeInstanceOf(Buffer);
            expect(text).toMatch(/^[A-F0-9]+$/);
        });
        
        test("should respect custom dimensions", async () => {
            const { image } = createCaptcha(400, 200);
            const buffer = await image;
            
            // PNG signature check
            expect(buffer.slice(0, 8)).toEqual(
                Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
            );
        });
    });
    
    describe("CaptchaGenerator Class", () => {
        test("should create instance with default dimensions", () => {
            const captcha = new CaptchaGenerator();
            expect(captcha).toBeInstanceOf(CaptchaGenerator);
        });
        
        test("should handle method chaining", async () => {
            const captcha = new CaptchaGenerator()
                .setDimension(350, 120)
                .setCaptcha({ text: "TEST123" })
                .setTrace({ color: "#ff0000" });
            
            const buffer = await captcha.generate();
            expect(buffer).toBeInstanceOf(Buffer);
            expect(captcha.text).toBe("TEST123");
        });
        
        test("should generate random text when characters specified", async () => {
            const captcha = new CaptchaGenerator()
                .setCaptcha({ characters: 8 });
            
            await captcha.generate();
            expect(captcha.text).toHaveLength(8);
            expect(captcha.text).toMatch(/^[A-F0-9]+$/);
        });
        
        test("should handle multi-styled text arrays", async () => {
            const captcha = new CaptchaGenerator()
                .setCaptcha([
                    { text: "HE", color: "#ff0000" },
                    { text: "LLO", color: "#00ff00" }
                ]);
            
            await captcha.generate();
            expect(captcha.text).toBe("HELLO");
        });
    });
    
    describe("Configuration Validation", () => {
        test("should handle invalid dimensions gracefully", () => {
            expect(() => {
                new CaptchaGenerator({ width: -100, height: -50 });
            }).not.toThrow();
        });
        
        test("should throw error for array captcha without text", () => {
            expect(() => {
                new CaptchaGenerator().setCaptcha([
                    { size: 40 }, // Missing text property
                    { text: "WORLD" }
                ]);
            }).toThrow("Each captcha option in array must have a text property.");
        });
    });
    
    describe("Performance Tests", () => {
        test("should generate CAPTCHA within reasonable time", async () => {
            const startTime = Date.now();
            const { image } = createCaptcha(300, 100);
            await image;
            const duration = Date.now() - startTime;
            
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });
        
        test("should handle batch generation efficiently", () => {
            const startTime = Date.now();
            const results = [];
            
            for (let i = 0; i < 10; i++) {
                const { image, text } = createCaptchaSync(300, 100);
                results.push({ image, text });
            }
            
            const duration = Date.now() - startTime;
            expect(results).toHaveLength(10);
            expect(duration).toBeLessThan(2000); // 10 CAPTCHAs in under 2 seconds
        });
    });
});
```

## Performance Optimization

### CAPTCHA Service with Caching

```javascript
const { CaptchaGenerator, resolveImage } = require("captcha-canvas");
const LRU = require("lru-cache");

class OptimizedCaptchaService {
    constructor(options = {}) {
        this.backgroundCache = new LRU({
            max: options.maxBackgrounds || 10,
            ttl: options.backgroundTTL || 1000 * 60 * 60 // 1 hour
        });
        
        this.generatorPool = [];
        this.poolSize = options.poolSize || 5;
        
        // Pre-create generator instances
        for (let i = 0; i < this.poolSize; i++) {
            this.generatorPool.push(new CaptchaGenerator());
        }
        
        this.currentGenerator = 0;
    }
    
    async loadBackground(path) {
        if (!this.backgroundCache.has(path)) {
            try {
                const image = await resolveImage(path);
                this.backgroundCache.set(path, image);
            } catch (error) {
                console.error(`Failed to load background: ${path}`, error);
                return null;
            }
        }
        return this.backgroundCache.get(path);
    }
    
    getGenerator() {
        const generator = this.generatorPool[this.currentGenerator];
        this.currentGenerator = (this.currentGenerator + 1) % this.poolSize;
        return generator;
    }
    
    async generateOptimized(config = {}) {
        const generator = this.getGenerator();
        
        // Reset generator state
        generator
            .setDimension(config.width || 300, config.height || 100)
            .setCaptcha(config.captcha || { characters: 6 })
            .setTrace(config.trace || { size: 3, opacity: 0.8 })
            .setDecoy(config.decoy || { total: 25, opacity: 0.3 });
        
        // Handle background if specified
        if (config.backgroundPath) {
            const background = await this.loadBackground(config.backgroundPath);
            if (background) {
                generator.setBackground(background);
            }
        }
        
        return {
            buffer: await generator.generate(),
            text: generator.text
        };
    }
}

// Usage
const service = new OptimizedCaptchaService({
    poolSize: 3,
    maxBackgrounds: 5
});
```

## Mobile-Friendly CAPTCHAs

### Responsive CAPTCHA Generation

```javascript
const { CaptchaGenerator } = require("captcha-canvas");

class ResponsiveCaptchaService {
    constructor() {
        this.presets = {
            mobile: {
                dimensions: { width: 250, height: 80 },
                captcha: { 
                    characters: 5, 
                    size: 28, 
                    rotate: 8,
                    skew: false  // Less distortion for mobile
                },
                trace: { size: 2, opacity: 0.6 },
                decoy: { total: 15, opacity: 0.2 }
            },
            tablet: {
                dimensions: { width: 320, height: 100 },
                captcha: { 
                    characters: 6, 
                    size: 35, 
                    rotate: 12 
                },
                trace: { size: 2.5, opacity: 0.7 },
                decoy: { total: 20, opacity: 0.25 }
            },
            desktop: {
                dimensions: { width: 400, height: 120 },
                captcha: { 
                    characters: 6, 
                    size: 45, 
                    rotate: 15 
                },
                trace: { size: 3, opacity: 0.8 },
                decoy: { total: 30, opacity: 0.3 }
            },
            accessibility: {
                dimensions: { width: 450, height: 150 },
                captcha: { 
                    characters: 5, 
                    size: 60, 
                    rotate: 5,    // Minimal rotation
                    skew: false,  // No skewing
                    color: "#000000"  // High contrast
                },
                trace: { size: 2, opacity: 0.3 },
                decoy: { total: 10, opacity: 0.1 }
            }
        };
    }
    
    async generate(deviceType = 'desktop', customConfig = {}) {
        const preset = this.presets[deviceType] || this.presets.desktop;
        
        // Merge preset with custom configuration
        const config = {
            dimensions: { ...preset.dimensions, ...customConfig.dimensions },
            captcha: { ...preset.captcha, ...customConfig.captcha },
            trace: { ...preset.trace, ...customConfig.trace },
            decoy: { ...preset.decoy, ...customConfig.decoy }
        };
        
        const captcha = new CaptchaGenerator(config.dimensions)
            .setCaptcha(config.captcha)
            .setTrace(config.trace)
            .setDecoy(config.decoy);
        
        return {
            buffer: await captcha.generate(),
            text: captcha.text,
            deviceType,
            config
        };
    }
    
    // Auto-detect device type from user agent
    detectDeviceType(userAgent) {
        const ua = userAgent.toLowerCase();
        
        if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
            return 'mobile';
        } else if (/tablet|ipad/.test(ua)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    // Generate accessibility-friendly CAPTCHA
    async generateAccessible(options = {}) {
        return this.generate('accessibility', {
            captcha: {
                ...options,
                // Force accessibility settings
                rotate: Math.min(options.rotate || 5, 5),
                skew: false,
                color: options.color || "#000000"
            }
        });
    }
}

// Express.js integration
const responsiveService = new ResponsiveCaptchaService();

app.get('/captcha', async (req, res) => {
    try {
        const deviceType = responsiveService.detectDeviceType(
            req.headers['user-agent'] || ''
        );
        
        const accessibility = req.query.accessibility === 'true';
        
        const result = accessibility 
            ? await responsiveService.generateAccessible()
            : await responsiveService.generate(deviceType);
        
        req.session.captcha = {
            solution: result.text,
            deviceType: result.deviceType,
            timestamp: Date.now()
        };
        
        res.type('png').send(result.buffer);
    } catch (error) {
        console.error('Responsive CAPTCHA error:', error);
        res.status(500).json({ error: 'CAPTCHA generation failed' });
    }
});
```

This comprehensive usage guide covers all the major use cases and patterns for the captcha-canvas library, from basic generation to advanced enterprise-level implementations with error handling, performance optimization, and accessibility considerations.