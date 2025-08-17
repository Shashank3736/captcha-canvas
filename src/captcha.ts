import { Canvas, CanvasRenderingContext2D, Image } from "skia-canvas";
import { defaultCaptchaOption, 
    defaultDecoyOptions, 
    defaultDimension, 
    defaultTraceOptions, 
    SetCaptchaOption, 
    SetDecoyOption, 
    SetTraceOption, 
    DrawCaptchaOption } from "./constants";
import { getRandom, getRandomCoordinate, randomText } from "./util";

/**
 * Core CAPTCHA class for low-level canvas operations and image generation.
 * 
 * This class provides direct access to the underlying canvas operations for creating
 * CAPTCHA images. It offers more granular control compared to CaptchaGenerator but
 * requires manual coordination of drawing operations. Use CaptchaGenerator for most
 * use cases unless you need fine-grained control over the rendering process.
 * 
 * @example Basic usage
 * ```typescript
 * const captcha = new Captcha(300, 100);
 * captcha.drawCaptcha({ text: 'HELLO', size: 40 });
 * captcha.drawTrace({ color: '#95a5a6' });
 * 
 * const buffer = await captcha.png;
 * console.log('Text:', captcha.text);
 * ```
 * 
 * @example Advanced multi-step generation
 * ```typescript
 * const captcha = new Captcha(400, 150, 6);
 * 
 * // Add background noise with decoys
 * captcha.addDecoy({ total: 30, opacity: 0.3 });
 * 
 * // Draw main captcha text
 * captcha.drawCaptcha({
 *   text: 'SECURE',
 *   size: 60,
 *   colors: ['#e74c3c', '#3498db']
 * });
 * 
 * // Add connecting trace lines
 * captcha.drawTrace({ size: 4, opacity: 0.8 });
 * 
 * // Add more decoys on top
 * captcha.addDecoy({ total: 20, opacity: 0.2 });
 * 
 * const buffer = await captcha.png;
 * ```
 */
export class Captcha {
    protected _height: number;
    protected _width: number;
    protected _captcha: SetCaptchaOption;
    protected _trace: SetTraceOption;
    protected _decoy: SetDecoyOption;
    protected _canvas: Canvas;
    protected _ctx: CanvasRenderingContext2D;
    protected _coordinates: number[][];
    public async: boolean;
    /**
     * Creates a new Captcha instance with specified canvas dimensions.
     * 
     * Initializes the underlying HTML5 canvas and 2D rendering context with
     * optimized settings for CAPTCHA generation. The canvas is configured
     * for high-quality text rendering and precise drawing operations.
     * 
     * @param width - Canvas width in pixels (default: 300)
     * @param height - Canvas height in pixels (default: 100)
     * @param characters - Expected number of characters for coordinate calculation (default: 6)
     * 
     * @example Standard CAPTCHA size
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * ```
     * 
     * @example Large CAPTCHA for better accessibility
     * ```typescript
     * const captcha = new Captcha(500, 200, 8);
     * ```
     * 
     * @example Mobile-optimized size
     * ```typescript
     * const captcha = new Captcha(250, 80, 5);
     * ```
     */
    constructor(width: number = defaultDimension.width, height: number = defaultDimension.height, characters: number = defaultCaptchaOption.characters ?? 6) {
        this._height = height;
        this._width = width;
        this._captcha = { ...defaultCaptchaOption, characters: characters };
        this._trace = defaultTraceOptions;
        this._decoy = defaultDecoyOptions;
        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        this._canvas = canvas;
        this._ctx = ctx;
        this.async = true;
        this._coordinates = [];
        this._canvas.gpu = false;
    }
    /**
     * Gets the current CAPTCHA text that has been drawn on the canvas.
     * 
     * Returns the text content that users need to enter to solve the CAPTCHA.
     * This value is set when `drawCaptcha()` is called and represents the
     * solution to the generated CAPTCHA image.
     * 
     * @returns The CAPTCHA text string, or empty string if no text has been set
     * 
     * @example
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha.drawCaptcha({ text: 'HELLO' });
     * console.log(captcha.text); // Output: "HELLO"
     * ```
     */
    get text(): string {
        return this._captcha.text || "";
    }
    /**
     * Gets the generated CAPTCHA image as a PNG buffer.
     * 
     * Returns either a Promise<Buffer> (async mode) or Buffer (sync mode) containing
     * the PNG-encoded image data. The mode is determined by the `async` property.
     * 
     * @returns PNG image buffer (Promise in async mode, Buffer in sync mode)
     * 
     * @example Async mode (default)
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha.drawCaptcha({ text: 'HELLO' });
     * 
     * const buffer = await captcha.png;
     * fs.writeFileSync('captcha.png', buffer);
     * ```
     * 
     * @example Sync mode
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha.async = false;
     * captcha.drawCaptcha({ text: 'HELLO' });
     * 
     * const buffer = captcha.png as Buffer;
     * fs.writeFileSync('captcha.png', buffer);
     * ```
     */
    get png(): Buffer | Promise<Buffer> {
        if(this.async) {
            return this._canvas.toBuffer('png');
        }
        else {
            return this._canvas.toBufferSync('png');
        }
    }
    /**
     * Draws a background image on the CAPTCHA canvas.
     * 
     * The image is automatically scaled to fit the entire canvas dimensions,
     * providing a background that increases visual complexity and security.
     * This should typically be called before drawing text and other elements.
     * 
     * @param image - Pre-loaded image object (use `resolveImage()` to load from file/URL)
     * @returns The Captcha instance for method chaining
     * 
     * @example With background image
     * ```typescript
     * import { resolveImage } from 'captcha-canvas';
     * 
     * const backgroundImage = await resolveImage('./noise-pattern.jpg');
     * const captcha = new Captcha(300, 100);
     * 
     * captcha
     *   .drawImage(backgroundImage)
     *   .drawCaptcha({ text: 'HELLO', opacity: 0.9 });
     * ```
     * 
     * @example Texture background
     * ```typescript
     * const texture = await resolveImage('https://example.com/texture.png');
     * const captcha = new Captcha(400, 150);
     * 
     * captcha
     *   .drawImage(texture)
     *   .addDecoy({ opacity: 0.2 })
     *   .drawCaptcha({ text: 'SECURE' });
     * ```
     */
    drawImage(image: Image): Captcha {
        this._ctx.drawImage(image, 0, 0, this._width, this._height);
        return this;
    }
    /**
     * Adds decoy characters to the CAPTCHA for enhanced security against OCR.
     * 
     * Decoy characters are randomly positioned fake characters that confuse
     * automated solving attempts while remaining distinguishable from real
     * text by humans through opacity, size, or positioning differences.
     * 
     * @param decoyOption - Configuration for decoy character appearance
     * @returns The Captcha instance for method chaining
     * 
     * @example Basic decoy setup
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha
     *   .addDecoy({ total: 25, opacity: 0.3 })
     *   .drawCaptcha({ text: 'HELLO' });
     * ```
     * 
     * @example Layered security with multiple decoy calls
     * ```typescript
     * const captcha = new Captcha(400, 150);
     * captcha
     *   .addDecoy({ total: 30, opacity: 0.2, size: 15 })  // Background noise
     *   .drawCaptcha({ text: 'SECURE' })
     *   .addDecoy({ total: 15, opacity: 0.1, size: 25 }); // Foreground confusion
     * ```
     * 
     * @example Custom decoy styling
     * ```typescript
     * const captcha = new Captcha(350, 120);
     * captcha
     *   .addDecoy({
     *     total: 40,
     *     color: '#95a5a6',
     *     font: 'Arial',
     *     size: 18,
     *     opacity: 0.25
     *   })
     *   .drawCaptcha({ text: 'VERIFY' });
     * ```
     */
    addDecoy(decoyOption: SetDecoyOption = {}): Captcha {
        const option = { ...this._decoy, ...decoyOption };
        if(!option.total) option.total = Math.floor(this._width * this._height/10000);

        const decoyText = randomText(option.total);
        this._ctx.font = `${option.size}px ${option.font}`;
        this._ctx.globalAlpha = (option.opacity ?? defaultDecoyOptions.opacity) as number;
        this._ctx.fillStyle = (option.color ?? defaultDecoyOptions.color) as string;
		for(const element of decoyText) {
			this._ctx.fillText(element, getRandom(30, this._width - 30), getRandom(30, this._height - 30));
		}
        return this;
    }
    /**
     * Draws connecting trace lines between CAPTCHA characters for enhanced security.
     * 
     * Trace lines connect the character positions, making character segmentation
     * significantly more difficult for automated systems while maintaining human
     * readability. The lines follow the character coordinates established by `drawCaptcha()`.
     * 
     * @param traceOption - Configuration for trace line appearance
     * @returns The Captcha instance for method chaining
     * 
     * @example Basic trace line
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha
     *   .drawCaptcha({ text: 'HELLO' })
     *   .drawTrace({ color: '#95a5a6', size: 3 });
     * ```
     * 
     * @example Subtle trace for better readability
     * ```typescript
     * const captcha = new Captcha(350, 120);
     * captcha
     *   .drawCaptcha({ text: 'VERIFY', size: 45 })
     *   .drawTrace({
     *     color: '#bdc3c7',
     *     size: 2,
     *     opacity: 0.6
     *   });
     * ```
     * 
     * @example Security-focused thick trace
     * ```typescript
     * const captcha = new Captcha(400, 150);
     * captcha
     *   .addDecoy({ total: 20, opacity: 0.2 })
     *   .drawCaptcha({ text: 'SECURE', size: 50 })
     *   .drawTrace({
     *     color: '#e74c3c',
     *     size: 5,
     *     opacity: 0.8
     *   });
     * ```
     * 
     * 
     * **Note:** Call `drawCaptcha()` before `drawTrace()` to ensure proper character coordinate calculation.
     */
    drawTrace(traceOption: SetTraceOption = {}): Captcha {
        const option = { ...this._trace, ...traceOption };
        if(!this._coordinates[0]) this._coordinates = getRandomCoordinate(this._height, this._width, this._captcha.characters || 6);
        const coordinates: number[][] = this._coordinates;

        this._ctx.strokeStyle = (option.color ?? defaultTraceOptions.color) as string;
  this._ctx.globalAlpha = (option.opacity ?? defaultTraceOptions.opacity) as number;

  this._ctx.beginPath();
  this._ctx.moveTo(coordinates[0][0], coordinates[0][1]);
  this._ctx.lineWidth = (option.size ?? defaultTraceOptions.size) as number;
		for(let i = 1; i < coordinates.length; i++) {
			this._ctx.lineTo(coordinates[i][0], coordinates[i][1]);
		}
		this._ctx.stroke();

        return this;
    }
    /**
     * Draws the main CAPTCHA text on the canvas with specified styling options.
     * 
     * This is the core method for rendering the CAPTCHA text that users need to solve.
     * Supports both single configuration objects and arrays for multi-styled text segments.
     * Character positions are automatically calculated and stored for trace line generation.
     * 
     * @param captchaOption - Single text configuration or array of configurations for multi-styled segments
     * @returns The Captcha instance for method chaining
     * 
     * @example Basic text rendering
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha.drawCaptcha({
     *   text: 'HELLO',
     *   size: 40,
     *   color: '#2c3e50'
     * });
     * ```
     * 
     * @example Advanced styling with transformations
     * ```typescript
     * const captcha = new Captcha(350, 120);
     * captcha.drawCaptcha({
     *   text: 'SECURE',
     *   size: 50,
     *   font: 'Arial',
     *   rotate: 15,        // Random rotation up to ±15 degrees per character
     *   skew: true,        // Apply random skewing transformation
     *   opacity: 0.85
     * });
     * ```
     * 
     * @example Multi-color text using colors array
     * ```typescript
     * const captcha = new Captcha(400, 150);
     * captcha.drawCaptcha({
     *   text: 'RAINBOW',
     *   size: 45,
     *   colors: ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6']
     * });
     * ```
     * 
     * @example Multi-styled text segments
     * ```typescript
     * const captcha = new Captcha(450, 150);
     * captcha.drawCaptcha([
     *   { text: 'SEC', size: 50, color: '#e74c3c', font: 'Arial', rotate: 10 },
     *   { text: 'URE', size: 45, color: '#27ae60', font: 'Times', skew: true }
     * ]);
     * ```
     * 
     * @example Random text generation
     * ```typescript
     * const captcha = new Captcha(300, 100);
     * captcha.drawCaptcha({
     *   characters: 6,     // Generate 6 random characters
     *   size: 40,
     *   colors: ['#34495e', '#e67e22']
     * });
     * console.log('Generated text:', captcha.text);
     * ```
     * 
     * @throws {Error} When array mode is used but text property is missing from segments
     * @throws {Error} When text length doesn't match specified character count
     */
    drawCaptcha(captchaOption: DrawCaptchaOption | DrawCaptchaOption[] = {}): Captcha {
        if (Array.isArray(captchaOption)) {
            let text = "";
            for (const option of captchaOption) {
                if (!option.text) throw new Error("Each captcha option in array must have a text property.");
                text += option.text;
            }
            this._captcha.text = text;
            this._captcha.characters = text.length;

            if(!this._coordinates[0]) this._coordinates = getRandomCoordinate(this._height, this._width, this._captcha.characters || 6);
            const coordinates: number[][] = this._coordinates;
            let charIndex = 0;

            for (const option of captchaOption) {
                const text = option.text || "";
                for (let i = 0; i < text.length; i++) {
                    this._ctx.save();
                    this._ctx.translate(coordinates[charIndex][0], coordinates[charIndex][1]);
                    this._ctx.font = `${option.size}px ${option.font}`;
                    this._ctx.globalAlpha = (option.opacity ?? defaultCaptchaOption.opacity) as number;
                    this._ctx.fillStyle = (option.color ?? defaultCaptchaOption.color) as string;
                    if (option.skew) {this._ctx.transform(1, Math.random(), getRandom(20) / 100, 1, 0, 0);}
                    if (option.rotate && option.rotate > 0) {this._ctx.rotate(getRandom(-option.rotate, option.rotate) * Math.PI / 180);}
                    if (option.colors && option.colors?.length >= 2) {this._ctx.fillStyle = option.colors[getRandom(option.colors.length - 1)];}
                    this._ctx.fillText(text[i], 0, 0);
                    this._ctx.restore();
                    charIndex++;
                }
            }

        } else {
            const option = { ...this._captcha, ...captchaOption };
            if(captchaOption.text) option.text = captchaOption.text;
            if(!option.text) option.text = randomText((option.characters ?? defaultCaptchaOption.characters) as number);
            if(option.text.length != option.characters) {
                if(captchaOption.text) {
                    throw new Error("Size of text and no. of characters is not matching.");
                }
                else {
                    option.text = randomText((option.characters ?? defaultCaptchaOption.characters) as number);
                }
            }
            this._captcha = option;
    
            if(!this._coordinates[0]) this._coordinates = getRandomCoordinate(this._height, this._width, option.characters || 6);
            const coordinates: number[][] = this._coordinates;
            
            this._ctx.font = `${option.size}px ${option.font}`;
            this._ctx.globalAlpha = (option.opacity ?? defaultCaptchaOption.opacity) as number;
            this._ctx.fillStyle = (option.color ?? defaultCaptchaOption.color) as string;
    
            for(let n = 0; n < coordinates.length; n++) {
                this._ctx.save();
                this._ctx.translate(coordinates[n][0], coordinates[n][1]);
                if (option.skew) {this._ctx.transform(1, Math.random(), getRandom(20) / 100, 1, 0, 0);}
                if (option.rotate && option.rotate > 0) {this._ctx.rotate(getRandom(-option.rotate, option.rotate) * Math.PI / 180);}
                if (option.colors && option.colors?.length >= 2) {this._ctx.fillStyle = option.colors[getRandom(option.colors.length - 1)];}
                this._ctx.fillText(option.text![n], 0, 0);
                this._ctx.restore();
            }
        }

        return this;
    }
}
