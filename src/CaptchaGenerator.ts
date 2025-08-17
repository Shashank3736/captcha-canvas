import { Image, loadImage } from "skia-canvas";
import { Captcha } from ".";
import { defaultCaptchaOption, defaultDecoyOptions, defaultTraceOptions, SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
import { randomText } from "./util";
/**
 * Advanced CAPTCHA generator class with fluent API for creating highly customizable CAPTCHAs.
 * 
 * This class provides a builder pattern interface for generating secure CAPTCHA images
 * with extensive customization options including text styling, background images,
 * trace lines, and decoy characters for enhanced security.
 * 
 * @example Basic usage
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setDimension(300, 100)
 *   .setCaptcha({ text: 'HELLO', size: 50 });
 * 
 * const buffer = await captcha.generate();
 * console.log('Generated text:', captcha.text);
 * ```
 * 
 * @example Advanced customization
 * ```typescript
 * const captcha = new CaptchaGenerator({ width: 400, height: 150 })
 *   .setCaptcha({
 *     text: 'SECURE',
 *     size: 60,
 *     colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
 *     rotate: 15,
 *     skew: true
 *   })
 *   .setTrace({ color: '#95a5a6', size: 3, opacity: 0.7 })
 *   .setDecoy({ total: 50, opacity: 0.4 })
 *   .setBackground('./background.jpg');
 * 
 * const buffer = await captcha.generate();
 * ```
 * 
 * @since 2.0.0
 */
export class CaptchaGenerator {
    private height: number;
    private width: number;
    private captcha: SetCaptchaOption | SetCaptchaOption[];
    private trace: SetTraceOption;
    private decoy: SetDecoyOption;
    private background?: string | Buffer;
    /**
     * Creates a new CaptchaGenerator instance with specified dimensions.
     * 
     * Initializes the generator with default settings and random text generation.
     * All configuration methods can be chained after construction for fluent API usage.
     * 
     * @param options - Configuration options for the CAPTCHA generator
     * @param options.height - Height of the CAPTCHA image in pixels (default: 100)
     * @param options.width - Width of the CAPTCHA image in pixels (default: 300)
     * 
     * @example Basic initialization
     * ```typescript
     * const captcha = new CaptchaGenerator();
     * // Creates 300x100 CAPTCHA with default settings
     * ```
     * 
     * @example Custom dimensions
     * ```typescript
     * const captcha = new CaptchaGenerator({ height: 200, width: 600 });
     * // Creates 600x200 CAPTCHA
     * ```
     * 
     * @since 2.0.0
     */
    constructor(options = { height: 100, width: 300 }) {
        this.height = options.height;
        this.width = options.width;
        this.captcha = defaultCaptchaOption;
        this.trace = defaultTraceOptions;
        this.decoy = defaultDecoyOptions;
        if(!Array.isArray(this.captcha)) {
            this.captcha.text = randomText(this.captcha.characters || 6);
        }
    }
    /**
     * Gets the current CAPTCHA text that will be displayed in the image.
     * 
     * This property returns the text that users need to enter to solve the CAPTCHA.
     * For array-based captchas with multiple text segments, it returns the concatenated result.
     * 
     * @returns The complete CAPTCHA text string
     * 
     * @example
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'HELLO' });
     * 
     * console.log(captcha.text); // Output: "HELLO"
     * ```
     * 
     * @example Array-based captcha
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha([
     *     { text: 'HE', color: '#ff0000' },
     *     { text: 'LLO', color: '#00ff00' }
     *   ]);
     * 
     * console.log(captcha.text); // Output: "HELLO"
     * ```
     * 
     * @since 2.0.3
     */
    get text(): string {
    	if (Array.isArray(this.captcha)) {
    		return this.captcha.map((c) => c.text || "").join("");
    	}
    	return this.captcha.text!;
    }
    /**
     * Sets the dimensions of the CAPTCHA image.
     * 
     * This method allows you to customize the width and height of the generated CAPTCHA image.
     * Larger dimensions provide more space for text and security features but result in larger file sizes.
     * 
     * @param height - Height of the CAPTCHA image in pixels
     * @param width - Width of the CAPTCHA image in pixels
     * @returns The CaptchaGenerator instance for method chaining
     * 
     * @example Standard web form size
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setDimension(150, 400);
     * ```
     * 
     * @example Large size for better readability
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setDimension(200, 600)
     *   .setCaptcha({ size: 80 }); // Larger text for larger canvas
     * ```
     * 
     * @example Mobile-friendly dimensions
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setDimension(100, 250);
     * ```
     * 
     * @since 2.0.0
     */
    setDimension(height: number, width: number): CaptchaGenerator {
        this.height = height;
        this.width = width;
        return this;
    }
    /**
     * Sets a background image for the CAPTCHA to increase visual complexity and security.
     * 
     * Background images make it significantly harder for OCR systems to automatically
     * solve the CAPTCHA while maintaining human readability. The image will be scaled
     * to fit the CAPTCHA dimensions.
     * 
     * @param image - Image source as file path, URL, or Buffer
     * @returns The CaptchaGenerator instance for method chaining
     * 
     * @example Using a local file path
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setBackground('./assets/noise-pattern.jpg')
     *   .setCaptcha({ opacity: 0.9 }); // Make text more visible over background
     * ```
     * 
     * @example Using a URL
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setBackground('https://example.com/background.png');
     * ```
     * 
     * @example Using a Buffer
     * ```typescript
     * import fs from 'fs';
     * 
     * const imageBuffer = fs.readFileSync('./background.jpg');
     * const captcha = new CaptchaGenerator()
     *   .setBackground(imageBuffer);
     * ```
     * 
     * @since 2.0.0
     */
    setBackground(image: string | Buffer) {
        this.background = image;
        return this;
    }
    /**
     * Configures the CAPTCHA text appearance and content.
     * 
     * This method allows extensive customization of the CAPTCHA text including font,
     * size, colors, rotation, skewing, and the actual text content. Supports both
     * single configuration objects and arrays for multi-styled text segments.
     * 
     * @param option - Single captcha configuration or array of configurations for multi-styled text
     * @returns The CaptchaGenerator instance for method chaining
     * 
     * @example Basic text customization
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({
     *     text: 'SECURE',
     *     font: 'Arial',
     *     size: 60,
     *     color: '#2c3e50'
     *   });
     * ```
     * 
     * @example Advanced styling with rotation and skewing
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({
     *     text: 'VERIFY',
     *     size: 50,
     *     rotate: 20,        // Random rotation up to ±20 degrees
     *     skew: true,        // Apply random skewing
     *     opacity: 0.8       // Semi-transparent text
     *   });
     * ```
     * 
     * @example Multi-color text using colors array
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({
     *     text: 'RAINBOW',
     *     size: 45,
     *     colors: ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6']
     *   });
     * ```
     * 
     * @example Multi-styled text segments
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha([
     *     { text: 'SEC', size: 50, color: '#e74c3c', font: 'Arial' },
     *     { text: 'URE', size: 45, color: '#27ae60', font: 'Times' }
     *   ]);
     * ```
     * 
     * @example Random text generation
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({
     *     characters: 8,     // Generate 8 random characters
     *     size: 40,
     *     colors: ['#34495e', '#e67e22']
     *   });
     * ```
     * 
     * @since 2.0.0
     */
    setCaptcha(option: SetCaptchaOption | SetCaptchaOption[]) {
    	if (Array.isArray(option)) {
    		this.captcha = option.map((o) => ({ ...defaultCaptchaOption, ...o }));
    		for (const o of this.captcha) {
    			if (!o.text)
    				throw new Error(
    					"Each captcha option in array must have a text property."
    				);
    			o.characters = o.text.length;
    		}
    	} else {
    		this.captcha = {
    			...(Array.isArray(this.captcha) ? defaultCaptchaOption : this.captcha),
    			...option,
    		};
    		if (!Array.isArray(this.captcha)) {
    			if (option.text) this.captcha.characters = option.text.length;
    			else if (this.captcha.characters)
    				this.captcha.text = randomText(this.captcha.characters);
    		}
    	}
    	return this;
    }
    /**
     * Configures trace lines that connect CAPTCHA characters for enhanced security.
     * 
     * Trace lines are drawn connecting the CAPTCHA characters, making it significantly
     * harder for automated systems to segment and recognize individual characters while
     * maintaining human readability.
     * 
     * @param option - Trace line appearance configuration
     * @returns The CaptchaGenerator instance for method chaining
     * 
     * @example Basic trace line
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'HELLO' })
     *   .setTrace({ color: '#95a5a6', size: 3 });
     * ```
     * 
     * @example Subtle trace for better readability
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'VERIFY' })
     *   .setTrace({
     *     color: '#bdc3c7',
     *     size: 2,
     *     opacity: 0.6      // Semi-transparent trace
     *   });
     * ```
     * 
     * @example Bold security trace
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'SECURE' })
     *   .setTrace({
     *     color: '#e74c3c',
     *     size: 5,
     *     opacity: 0.8
     *   });
     * ```
     * 
     * @example Disable trace lines
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'CLEAN' })
     *   .setTrace({ opacity: 0 }); // Completely transparent = disabled
     * ```
     * 
     * @since 2.0.0
     */
    setTrace(option: SetTraceOption) {
        this.trace = { ...this.trace, ...option };
        return this;
    }
    /**
     * Configures decoy characters that add visual noise to prevent automated solving.
     * 
     * Decoy characters are randomly placed fake characters that confuse OCR systems
     * while being distinguishable from the actual CAPTCHA text by humans through
     * differences in opacity, size, or color.
     * 
     * @param option - Decoy characters configuration
     * @returns The CaptchaGenerator instance for method chaining
     * 
     * @example Basic decoy setup
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'HELLO' })
     *   .setDecoy({
     *     total: 30,
     *     opacity: 0.3,
     *     color: '#95a5a6'
     *   });
     * ```
     * 
     * @example Subtle decoys for clean look
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'VERIFY' })
     *   .setDecoy({
     *     total: 15,
     *     size: 12,
     *     opacity: 0.2,
     *     font: 'Arial'
     *   });
     * ```
     * 
     * @example Heavy security with many decoys
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'SECURE' })
     *   .setDecoy({
     *     total: 50,
     *     size: 18,
     *     opacity: 0.4,
     *     color: '#7f8c8d'
     *   });
     * ```
     * 
     * @example Disable decoy characters
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'SIMPLE' })
     *   .setDecoy({ opacity: 0 }); // No decoy characters
     * ```
     * 
     * @since 2.0.0
     */
    setDecoy(option: SetDecoyOption) {
        this.decoy = { ...this.decoy, ...option };
        return this;
    }
    /**
     * Generates the final CAPTCHA image as a PNG buffer asynchronously.
     * 
     * This method renders all configured elements (background, decoys, text, traces)
     * into a final PNG image buffer that can be saved to file or sent to clients.
     * The generation process is asynchronous to handle background image loading.
     * 
     * @returns Promise that resolves to a PNG image buffer
     * 
     * @example Basic generation and file saving
     * ```typescript
     * import fs from 'fs';
     * 
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'HELLO' });
     * 
     * const buffer = await captcha.generate();
     * fs.writeFileSync('captcha.png', buffer);
     * console.log('CAPTCHA text:', captcha.text);
     * ```
     * 
     * @example Web server response
     * ```typescript
     * import express from 'express';
     * 
     * app.get('/captcha', async (req, res) => {
     *   const captcha = new CaptchaGenerator()
     *     .setDimension(300, 100)
     *     .setCaptcha({ characters: 6 });
     *   
     *   const buffer = await captcha.generate();
     *   
     *   // Store captcha.text in session for verification
     *   req.session.captcha = captcha.text;
     *   
     *   res.type('png').send(buffer);
     * });
     * ```
     * 
     * @example Complete customization
     * ```typescript
     * const captcha = new CaptchaGenerator({ width: 400, height: 150 })
     *   .setBackground('./noise-bg.jpg')
     *   .setCaptcha({
     *     text: 'SECURE',
     *     size: 60,
     *     colors: ['#e74c3c', '#3498db'],
     *     rotate: 15
     *   })
     *   .setTrace({ color: '#95a5a6', size: 3 })
     *   .setDecoy({ total: 40, opacity: 0.3 });
     * 
     * const buffer = await captcha.generate();
     * ```
     * 
     * @throws {Error} When background image fails to load or other rendering errors occur
     * 
     * @since 2.0.0
     */
    async generate(): Promise<Buffer> {
        const captchaCanvas = new Captcha(this.width, this.height);

        if(this.background) captchaCanvas.drawImage(await loadImage(this.background));
        if(this.decoy.opacity) captchaCanvas.addDecoy(this.decoy);
        if(this.captcha) captchaCanvas.drawCaptcha(this.captcha as any);
        if(this.trace.opacity) captchaCanvas.drawTrace(this.trace);
        return captchaCanvas.png;
    }
    /**
     * Generates the CAPTCHA image synchronously without async/await.
     * 
     * This method provides synchronous CAPTCHA generation for use cases where
     * async operations are not suitable. Note that background images set via
     * `setBackground()` are ignored - use the `background` parameter instead.
     * 
     * @param option - Additional options for synchronous generation
     * @param option.background - Pre-loaded background image (use `resolveImage()` to load)
     * @returns PNG image buffer
     * 
     * @example Basic synchronous generation
     * ```typescript
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'SYNC' });
     * 
     * const buffer = captcha.generateSync();
     * fs.writeFileSync('captcha.png', buffer);
     * ```
     * 
     * @example With pre-loaded background image
     * ```typescript
     * import { CaptchaGenerator, resolveImage } from 'captcha-canvas';
     * 
     * // Load background image first
     * const backgroundImage = await resolveImage('./background.jpg');
     * 
     * const captcha = new CaptchaGenerator()
     *   .setCaptcha({ text: 'HELLO' });
     * 
     * // Generate synchronously with background
     * const buffer = captcha.generateSync({ background: backgroundImage });
     * fs.writeFileSync('captcha.png', buffer);
     * ```
     * 
     * @example Synchronous generation in non-async context
     * ```typescript
     * function createCaptchaSync() {
     *   const captcha = new CaptchaGenerator()
     *     .setDimension(250, 80)
     *     .setCaptcha({ characters: 5, size: 35 })
     *     .setTrace({ size: 2, opacity: 0.7 });
     *   
     *   return {
     *     buffer: captcha.generateSync(),
     *     text: captcha.text
     *   };
     * }
     * ```
     * 
     * 
     * **Note:** Background images set via `setBackground()` are not used in sync mode.
     * Use the `background` parameter with pre-loaded images instead.
     * 
     * @since 2.2.0
     */
    generateSync(option: { background?: Image } = {}): Buffer {
        const captchaCanvas = new Captcha(
        	this.width,
        	this.height,
        	Array.isArray(this.captcha)
        		? this.captcha.reduce((acc, val) => acc + (val.characters || 0), 0)
        		: this.captcha.characters
        );
        captchaCanvas.async = false;

        if(option.background) captchaCanvas.drawImage(option.background);
        if(this.decoy.opacity) captchaCanvas.addDecoy(this.decoy);
        if(this.captcha) captchaCanvas.drawCaptcha(this.captcha as any);
        if(this.trace.opacity) captchaCanvas.drawTrace(this.trace);

        return captchaCanvas.png as Buffer;
    }
}