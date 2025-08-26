import { randomBytes } from 'crypto';
import { merge } from './util';
import {
	defaultCaptchaOptions,
	defaultTraceOptions,
	SetTraceOptions,
	SetDecoyOptions,
	defaultDecoyOptions,
	SetCaptchaOptions,
	SetDimensionOption,
} from './constants';
import { createCanvas, loadImage, Image } from 'canvas';

const PD = 30;

/**
 * Generates a random number between two values (inclusive).
 * 
 * @param start - The minimum value (inclusive)
 * @param end - The maximum value (inclusive)
 * @returns A random integer between start and end
 * 
 * @example
 * ```typescript
 * const randomAngle = getRandom(-15, 15); // Random angle between -15 and 15 degrees
 * const randomHeight = getRandom(50, 200); // Random height between 50 and 200 pixels
 * ```
 * 
 * @internal
 */
function getRandom(start: number, end: number): number {
	start = start || 0;
	end = end || 0;
	return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
}
/**
 * A powerful and flexible CAPTCHA generator that creates secure, customizable CAPTCHA images.
 * 
 * The CaptchaGenerator class provides a fluent API for creating highly customized CAPTCHA images
 * with features like custom fonts, colors, rotation, skewing, trace lines, decoy characters,
 * and background images. It's designed to be both easy to use for simple cases and highly
 * configurable for advanced security requirements.
 * 
 * @example Basic Usage
 * ```typescript
 * import { CaptchaGenerator } from 'captcha-canvas';
 * 
 * const captcha = new CaptchaGenerator()
 *   .setDimension(150, 400)
 *   .setCaptcha({ size: 60, color: 'blue' });
 * 
 * const buffer = await captcha.generate();
 * console.log('Captcha text:', captcha.text);
 * ```
 * 
 * @example Advanced Configuration
 * ```typescript
 * const captcha = new CaptchaGenerator({ height: 200, width: 500 })
 *   .setCaptcha({
 *     text: 'SECURE',
 *     colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
 *     font: 'Arial',
 *     size: 70,
 *     rotate: 15,
 *     skew: true
 *   })
 *   .setTrace({
 *     color: '#ff6b6b',
 *     size: 4,
 *     opacity: 0.7
 *   })
 *   .setDecoy({
 *     opacity: 0.4,
 *     size: 25
 *   });
 * 
 * const buffer = await captcha.generate();
 * ```
 * 
 * @example Segmented Text Styling
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setDimension(150, 450)
 *   .setCaptcha([
 *     { text: 'SEC', color: '#e74c3c', size: 60, start: 0, end: 3 },
 *     { text: 'URE', color: '#3498db', size: 50, start: 3, end: 6 }
 *   ]);
 * 
 * console.log('Text:', captcha.text); // "SECURE"
 * ```
 * 
 * @example With Background Image
 * ```typescript
 * import fs from 'fs';
 * 
 * const backgroundBuffer = fs.readFileSync('./background.jpg');
 * const captcha = new CaptchaGenerator()
 *   .setDimension(200, 400)
 *   .setBackground(backgroundBuffer)
 *   .setCaptcha({ color: 'white', size: 50, opacity: 0.9 });
 * 
 * const buffer = await captcha.generate();
 * ```
 */
class CaptchaGenerator {
	private height: number;
	private width: number;
	private captcha: SetCaptchaOptions;
	private trace: SetTraceOptions;
	private decoy: SetDecoyOptions;
	private background?: Buffer | string;
	private captchaSegments: SetCaptchaOptions[] = [];
	/**
	 * Creates a new CaptchaGenerator instance with optional initial dimensions.
	 * 
	 * @param options - Initial configuration options for canvas dimensions
	 * 
	 * @example
	 * ```typescript
	 * // Create with default dimensions (100x300)
	 * const captcha = new CaptchaGenerator();
	 * 
	 * // Create with custom dimensions
	 * const captcha = new CaptchaGenerator({ height: 200, width: 500 });
	 * ```
	 */
	constructor(options: SetDimensionOption = {}) {
		this.height = options.height || 100;
		this.width = options.width || 300;
		this.captcha = defaultCaptchaOptions;
		this.trace = defaultTraceOptions;
		this.decoy = defaultDecoyOptions;
		this.captcha.text = randomBytes(32)
			.toString('hex')
			.toUpperCase()
			.replace(/[^a-z]/gi, '')
			.substr(0, this.captcha.characters);
	}
	/**
	 * Gets the current captcha text that should be used for verification.
	 * 
	 * This property returns the text that the user needs to enter to pass the captcha challenge.
	 * The text is automatically generated when the captcha is created or can be set manually
	 * using the setCaptcha method.
	 * 
	 * @returns The captcha text string
	 * 
	 * @example
	 * ```typescript
	 * const captcha = new CaptchaGenerator();
	 * console.log('User should enter:', captcha.text); // e.g., "A3X9K2"
	 * 
	 * // With custom text
	 * captcha.setCaptcha({ text: 'HELLO' });
	 * console.log('User should enter:', captcha.text); // "HELLO"
	 * ```
	 */
	get text(): string {
		return this.captcha.text || '';
	}
	/**
	 * Sets the canvas dimensions for the captcha image.
	 * 
	 * The dimensions affect the overall size of the generated captcha image and should be
	 * chosen based on your application's requirements. Larger dimensions provide more space
	 * for text and visual effects but may impact performance.
	 * 
	 * @param height - Canvas height in pixels (recommended: 100-300)
	 * @param width - Canvas width in pixels (recommended: 200-600)
	 * @returns The CaptchaGenerator instance for method chaining
	 * 
	 * @example
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setDimension(150, 400)  // 150px height, 400px width
	 *   .setCaptcha({ size: 60 });
	 * 
	 * // Method chaining allows fluent configuration
	 * const buffer = await captcha.generate();
	 * ```
	 */
	setDimension(height: number, width: number): this {
		this.height = height;
		this.width = width;
		return this;
	}
	/**
	 * Sets a background image for the captcha to increase visual complexity and security.
	 * 
	 * Background images make it significantly harder for OCR systems to accurately read
	 * the captcha text. The image will be automatically resized to fit the canvas dimensions.
	 * Supported formats include JPEG, PNG, GIF, and other formats supported by the canvas library.
	 * 
	 * @param image - Background image as a Buffer or file path string
	 * @returns The CaptchaGenerator instance for method chaining
	 * 
	 * @example Using Buffer
	 * ```typescript
	 * import fs from 'fs';
	 * 
	 * const backgroundBuffer = fs.readFileSync('./background.jpg');
	 * const captcha = new CaptchaGenerator()
	 *   .setDimension(200, 400)
	 *   .setBackground(backgroundBuffer)
	 *   .setCaptcha({ color: 'white', opacity: 0.9 });
	 * ```
	 * 
	 * @example Using File Path
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setBackground('./assets/background.png')
	 *   .setCaptcha({ color: 'yellow', size: 50 });
	 * ```
	 */
	setBackground(image: Buffer | string): this {
		this.background = image;
		return this;
	}
	/**
	 * Configures the captcha text appearance and behavior.
	 * 
	 * This method accepts either a single options object for uniform styling or an array
	 * of options for segmented styling where different parts of the text can have different
	 * appearances. This is the core method for customizing how your captcha looks.
	 * 
	 * @param options - Single options object or array of options for segmented styling
	 * @returns The CaptchaGenerator instance for method chaining
	 * 
	 * @example Basic Text Styling
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({
	 *     text: 'HELLO',        // Custom text (auto-generated if not provided)
	 *     color: 'blue',        // Text color
	 *     size: 60,             // Font size in pixels
	 *     font: 'Arial',        // Font family
	 *     rotate: 10,           // Max rotation angle in degrees
	 *     skew: true,           // Enable text skewing
	 *     opacity: 0.8          // Text opacity (0-1)
	 *   });
	 * ```
	 * 
	 * @example Multiple Colors
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({
	 *     characters: 6,
	 *     colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
	 *     size: 50,
	 *     rotate: 15
	 *   });
	 * ```
	 * 
	 * @example Segmented Styling
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha([
	 *     { text: 'SEC', color: '#e74c3c', size: 60, start: 0, end: 3 },
	 *     { text: 'URE', color: '#3498db', size: 50, start: 3, end: 6 }
	 *   ]);
	 * 
	 * console.log(captcha.text); // "SECURE"
	 * ```
	 * 
	 * @example Auto-generated Text
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({
	 *     characters: 8,        // Generate 8 random characters
	 *     size: 45,
	 *     colors: ['red', 'blue', 'green']
	 *   });
	 * 
	 * console.log(captcha.text); // e.g., "A7X9M2K5"
	 * ```
	 */
	setCaptcha(options: SetCaptchaOptions | SetCaptchaOptions[]): this {
		if (Array.isArray(options)) {
			this.captchaSegments = options;
			const textFromSegments = options.map(opt => opt.text).filter(Boolean).join('');
			if (textFromSegments) {
				this.captcha.text = textFromSegments;
				this.captcha.characters = textFromSegments.length;
			} else if (!this.captcha.text || !this.captcha.characters) {
				this.captcha.characters = this.captcha.characters || defaultCaptchaOptions.characters;
				this.captcha.text = randomBytes(32)
					.toString('hex')
					.toUpperCase()
					.replace(/[^a-z]/gi, '')
					.substr(0, this.captcha.characters);
			}

		} else {
			this.captchaSegments = [options];
			this.captcha = merge(this.captcha, options) as SetCaptchaOptions;
			if (options.text) this.captcha.characters = options.text.length;
			if (!options.text && options.characters) {
				this.captcha.text = randomBytes(32)
					.toString('hex')
					.toUpperCase()
					.replace(/[^a-z]/gi, '')
					.substr(0, options.characters);
			}
		}
		return this;
	}
	/**
	 * Configures trace lines that connect the captcha characters.
	 * 
	 * Trace lines are drawn between character positions to add visual complexity and
	 * make it harder for automated systems to isolate individual characters. These lines
	 * significantly improve the security of your captcha by creating visual noise that
	 * confuses OCR systems while remaining readable to humans.
	 * 
	 * @param options - Configuration options for trace lines
	 * @returns The CaptchaGenerator instance for method chaining
	 * 
	 * @example Basic Trace Lines
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({ size: 60 })
	 *   .setTrace({
	 *     color: 'red',         // Line color
	 *     size: 3,              // Line width in pixels
	 *     opacity: 0.8          // Line opacity (0-1)
	 *   });
	 * ```
	 * 
	 * @example Subtle Trace Lines
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({ color: 'blue', size: 50 })
	 *   .setTrace({
	 *     color: 'lightblue',
	 *     size: 2,
	 *     opacity: 0.5          // Semi-transparent for subtle effect
	 *   });
	 * ```
	 * 
	 * @example Matching Text Color
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({ color: '#32cf7e', size: 55 })
	 *   .setTrace({
	 *     color: '#32cf7e',     // Same color as text
	 *     size: 4,
	 *     opacity: 0.7
	 *   });
	 * ```
	 */
	setTrace(options: SetTraceOptions): this {
		this.trace = merge(this.trace, options) as SetTraceOptions;
		return this;
	}
	/**
	 * Configures decoy characters that are scattered across the captcha background.
	 * 
	 * Decoy characters are random characters placed throughout the captcha image to
	 * confuse OCR systems and automated solvers. They appear as background noise and
	 * make it significantly harder for bots to identify the actual captcha text.
	 * The number of decoy characters is automatically calculated based on canvas size.
	 * 
	 * @param options - Configuration options for decoy characters
	 * @returns The CaptchaGenerator instance for method chaining
	 * 
	 * @example Basic Decoy Characters
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({ size: 60, color: 'black' })
	 *   .setDecoy({
	 *     color: 'gray',        // Decoy text color
	 *     font: 'Arial',        // Font family for decoys
	 *     size: 20,             // Font size for decoys
	 *     opacity: 0.5          // Opacity (0-1)
	 *   });
	 * ```
	 * 
	 * @example Subtle Decoys
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({ size: 50, color: 'blue' })
	 *   .setDecoy({
	 *     color: 'lightgray',
	 *     size: 15,             // Smaller than main text
	 *     opacity: 0.3          // Very subtle
	 *   });
	 * ```
	 * 
	 * @example High Security Decoys
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setCaptcha({ size: 55, color: 'darkblue' })
	 *   .setDecoy({
	 *     color: 'blue',
	 *     size: 25,
	 *     opacity: 0.6          // More visible for higher security
	 *   });
	 * ```
	 */
	setDecoy(options: SetDecoyOptions): this {
		this.decoy = merge(this.decoy, options) as SetDecoyOptions;
		return this;
	}
	/**
	 * Generates the captcha image asynchronously and returns it as a PNG buffer.
	 * 
	 * This method creates the final captcha image by rendering all configured elements
	 * (text, trace lines, decoy characters, background) onto a canvas. The method is
	 * asynchronous to handle background image loading if a background is set.
	 * 
	 * @returns Promise that resolves to a PNG image buffer
	 * 
	 * @example Basic Generation
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setDimension(150, 400)
	 *   .setCaptcha({ size: 60 });
	 * 
	 * const buffer = await captcha.generate();
	 * 
	 * // Save to file
	 * import fs from 'fs';
	 * fs.writeFileSync('captcha.png', buffer);
	 * 
	 * // Get the text for verification
	 * console.log('Captcha text:', captcha.text);
	 * ```
	 * 
	 * @example Express.js Response
	 * ```typescript
	 * app.get('/captcha', async (req, res) => {
	 *   const captcha = new CaptchaGenerator()
	 *     .setDimension(150, 400)
	 *     .setCaptcha({ size: 60 });
	 * 
	 *   const buffer = await captcha.generate();
	 *   
	 *   res.setHeader('Content-Type', 'image/png');
	 *   res.send(buffer);
	 * });
	 * ```
	 * 
	 * @example With Background Image
	 * ```typescript
	 * import fs from 'fs';
	 * 
	 * const backgroundBuffer = fs.readFileSync('./background.jpg');
	 * const captcha = new CaptchaGenerator()
	 *   .setBackground(backgroundBuffer)
	 *   .setCaptcha({ color: 'white', size: 50 });
	 * 
	 * const buffer = await captcha.generate();
	 * ```
	 */
	async generate(): Promise<Buffer> {
		const canvas = createCanvas(this.width, this.height);
		const ctx = canvas.getContext('2d');
		ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';

		let coordinates: number[][] = [];
		if (!this.captcha.characters) this.captcha.characters = 0;
		for (let i = 0; i < this.captcha.characters; i++) {
			const widthGap = Math.floor(this.width / (this.captcha.characters || 1));
			const coordinate: number[] = [];
			const randomWidth = widthGap * (i + 0.2);
			coordinate.push(randomWidth);
			const randomHeight = getRandom(PD, this.height - PD);
			coordinate.push(randomHeight);
			coordinates.push(coordinate);
		}
		coordinates = coordinates.sort((a, b) => a[0] - b[0]);

		if (this.background) {
			const background = await loadImage(this.background);
			ctx.drawImage(background, 0, 0, this.width, this.height);
		}

		if (this.decoy.opacity) {
			const decoyTextCount = Math.floor((this.height * this.width) / 10000);
			const decoyText = randomBytes(decoyTextCount).toString('hex').split('');
			ctx.font = `${this.decoy.size}px ${this.decoy.font}`;
			ctx.globalAlpha = this.decoy.opacity;
			ctx.fillStyle = this.decoy.color || '#000000';
			for (let i = 0; i < decoyText.length; i++) {
				ctx.fillText(
					decoyText[i],
					getRandom(PD, this.width - PD),
					getRandom(PD, this.height - PD)
				);
			}
		}

		if (this.trace.opacity) {
			ctx.strokeStyle = this.trace.color || '#000000';
			ctx.globalAlpha = this.trace.opacity;
			ctx.beginPath();
			ctx.moveTo(coordinates[0][0], coordinates[0][1]);
			ctx.lineWidth = this.trace.size || 1;
			for (let i = 1; i < coordinates.length; i++) {
				ctx.lineTo(coordinates[i][0], coordinates[i][1]);
			}
			ctx.stroke();
		}

		if (this.captcha.opacity) {
			for (let n = 0; n < coordinates.length; n++) {
				const char = this.captcha.text ? this.captcha.text[n] : '';
				let charOptions = { ...this.captcha }; // Default to global captcha options

				// Find specific options for this character
				for (const segmentOpt of this.captchaSegments) {
					const start = segmentOpt.start !== undefined ? segmentOpt.start : 0;
					const end = segmentOpt.end !== undefined ? segmentOpt.end : this.captcha.characters;

					if (n >= start && n < end) {
						charOptions = merge(charOptions, segmentOpt) as SetCaptchaOptions;
					}
				}

				ctx.font = `${charOptions.size}px ${charOptions.font}`;
				ctx.globalAlpha = charOptions.opacity || 1;
				ctx.fillStyle = charOptions.color || '#000000';

				ctx.save();
				ctx.translate(coordinates[n][0], coordinates[n][1]);
				if (charOptions.skew) {
					ctx.transform(1, Math.random(), getRandom(0, 20) / 100, 1, 0, 0);
				}
				if (charOptions.rotate && charOptions.rotate > 0) {
					ctx.rotate(
						(getRandom(-charOptions.rotate, charOptions.rotate) * Math.PI) / 180
					);
				}
				if (charOptions.colors && charOptions.colors.length >= 2) {
					ctx.fillStyle = charOptions.colors[
						getRandom(0, charOptions.colors.length - 1)
					];
				}
				ctx.fillText(char, 0, 0);
				ctx.restore();
			}
		}

		return canvas.toBuffer();
	}
	/**
	 * Generates the captcha image synchronously and returns it as a PNG buffer.
	 * 
	 * This method creates the captcha image without using async/await, making it suitable
	 * for synchronous workflows. If you need to use a background image, you must pre-load
	 * it using the canvas library's loadImage function and pass it in the options.
	 * 
	 * @param options - Optional configuration for synchronous generation
	 * @param options.background - Pre-loaded background image (use loadImage from canvas)
	 * @returns PNG image buffer
	 * 
	 * @example Basic Synchronous Generation
	 * ```typescript
	 * const captcha = new CaptchaGenerator()
	 *   .setDimension(150, 400)
	 *   .setCaptcha({ size: 60, color: 'blue' });
	 * 
	 * const buffer = captcha.generateSync();
	 * 
	 * // Save to file
	 * import fs from 'fs';
	 * fs.writeFileSync('captcha.png', buffer);
	 * console.log('Captcha text:', captcha.text);
	 * ```
	 * 
	 * @example With Pre-loaded Background
	 * ```typescript
	 * import { loadImage } from 'canvas';
	 * 
	 * // Pre-load the background image
	 * const backgroundImage = await loadImage('./background.jpg');
	 * 
	 * const captcha = new CaptchaGenerator()
	 *   .setDimension(200, 400)
	 *   .setCaptcha({ color: 'white', size: 50 });
	 * 
	 * // Generate synchronously with pre-loaded background
	 * const buffer = captcha.generateSync({ background: backgroundImage });
	 * ```
	 * 
	 * @example Performance Comparison
	 * ```typescript
	 * // Synchronous - faster for simple captchas without backgrounds
	 * const buffer1 = captcha.generateSync();
	 * 
	 * // Asynchronous - required for background images from file/URL
	 * const buffer2 = await captcha.generate();
	 * ```
	 */
	generateSync(options: { background?: Image } = {}): Buffer {
		const canvas = createCanvas(this.width, this.height);
		const ctx = canvas.getContext('2d');
		ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';

		let coordinates: number[][] = [];
		if (!this.captcha.characters) this.captcha.characters = 0;
		for (let i = 0; i < this.captcha.characters; i++) {
			const widthGap = Math.floor(this.width / (this.captcha.characters || 1));
			const coordinate: number[] = [];
			const randomWidth = widthGap * (i + 0.2);
			coordinate.push(randomWidth);
			const randomHeight = getRandom(PD, this.height - PD);
			coordinate.push(randomHeight);
			coordinates.push(coordinate);
		}
		coordinates = coordinates.sort((a, b) => a[0] - b[0]);

		if (options.background) {
			ctx.drawImage(options.background, 0, 0, this.width, this.height);
		}

		if (this.decoy.opacity) {
			const decoyTextCount = Math.floor((this.height * this.width) / 10000);
			const decoyText = randomBytes(decoyTextCount).toString('hex').split('');
			ctx.font = `${this.decoy.size}px ${this.decoy.font}`;
			ctx.globalAlpha = this.decoy.opacity;
			ctx.fillStyle = this.decoy.color || '#000000';
			for (let i = 0; i < decoyText.length; i++) {
				ctx.fillText(
					decoyText[i],
					getRandom(PD, this.width - PD),
					getRandom(PD, this.height - PD)
				);
			}
		}

		if (this.trace.opacity) {
			ctx.strokeStyle = this.trace.color || '#000000';
			ctx.globalAlpha = this.trace.opacity;
			ctx.beginPath();
			ctx.moveTo(coordinates[0][0], coordinates[0][1]);
			ctx.lineWidth = this.trace.size || 1;
			for (let i = 1; i < coordinates.length; i++) {
				ctx.lineTo(coordinates[i][0], coordinates[i][1]);
			}
			ctx.stroke();
		}

		if (this.captcha.opacity) {
			for (let n = 0; n < coordinates.length; n++) {
				const char = this.captcha.text ? this.captcha.text[n] : '';
				let charOptions = { ...this.captcha }; // Default to global captcha options

				// Find specific options for this character
				for (const segmentOpt of this.captchaSegments) {
					const start = segmentOpt.start !== undefined ? segmentOpt.start : 0;
					const end = segmentOpt.end !== undefined ? segmentOpt.end : this.captcha.characters;

					if (n >= start && n < end) {
						charOptions = merge(charOptions, segmentOpt) as SetCaptchaOptions;
					}
				}

				ctx.font = `${charOptions.size}px ${charOptions.font}`;
				ctx.globalAlpha = charOptions.opacity || 1;
				ctx.fillStyle = charOptions.color || '#000000';

				ctx.save();
				ctx.translate(coordinates[n][0], coordinates[n][1]);
				if (charOptions.skew) {
					ctx.transform(1, Math.random(), getRandom(0, 20) / 100, 1, 0, 0);
				}
				if (charOptions.rotate && charOptions.rotate > 0) {
					ctx.rotate(
						(getRandom(-charOptions.rotate, charOptions.rotate) * Math.PI) / 180
					);
				}
				if (charOptions.colors && charOptions.colors.length >= 2) {
					ctx.fillStyle = charOptions.colors[
						getRandom(0, charOptions.colors.length - 1)
					];
				}
				ctx.fillText(char, 0, 0);
				ctx.restore();
			}
		}

		return canvas.toBuffer();
	}
}

export default CaptchaGenerator;
