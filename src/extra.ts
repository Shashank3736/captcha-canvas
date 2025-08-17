import { Captcha } from ".";
import { CreateCaptchaOptions } from "./constants";

/**
 * Result object for synchronous CAPTCHA generation containing the image and solution text.
 * 
 * @example
 * ```typescript
 * const result: CaptchaValueSync = createCaptchaSync(300, 100);
 * fs.writeFileSync('captcha.png', result.image);
 * console.log('Solution:', result.text);
 * ```
 */
export interface CaptchaValueSync {
    /**
     * The generated CAPTCHA image as a PNG buffer ready for saving or transmission
     */
    image: Buffer,
    /**
     * The text solution that users must enter to solve the CAPTCHA
     */
    text: string
}

/**
 * Result object for asynchronous CAPTCHA generation containing the image promise and solution text.
 * 
 * @example
 * ```typescript
 * const result: CaptchaValue = createCaptcha(300, 100);
 * const buffer = await result.image;
 * fs.writeFileSync('captcha.png', buffer);
 * console.log('Solution:', result.text);
 * ```
 */
export interface CaptchaValue {
    /**
     * Promise that resolves to the generated CAPTCHA image as a PNG buffer
     */
    image: Promise<Buffer>,
    /**
     * The text solution that users must enter to solve the CAPTCHA
     */
    text: string
}

/**
 * Creates a CAPTCHA image asynchronously with automatic security features.
 * 
 * This is the simplest way to generate a CAPTCHA with sensible defaults and automatic
 * security features including decoy characters, trace lines, and random text generation.
 * The function handles the complete generation process and returns both the image and solution.
 * 
 * @param width - Width of the CAPTCHA image in pixels
 * @param height - Height of the CAPTCHA image in pixels  
 * @param option - Optional configuration for customizing CAPTCHA appearance and security
 * @returns Object containing the image promise and solution text
 * 
 * @example Quick CAPTCHA generation
 * ```typescript
 * import { createCaptcha } from 'captcha-canvas';
 * import fs from 'fs';
 * 
 * const { image, text } = createCaptcha(300, 100);
 * const buffer = await image;
 * 
 * fs.writeFileSync('captcha.png', buffer);
 * console.log('Solution:', text);
 * ```
 * 
 * @example Custom text and styling
 * ```typescript
 * const { image, text } = createCaptcha(400, 150, {
 *   captcha: {
 *     text: 'HELLO',
 *     size: 60,
 *     colors: ['#e74c3c', '#3498db', '#27ae60']
 *   }
 * });
 * ```
 * 
 * @example Enhanced security configuration
 * ```typescript
 * const { image, text } = createCaptcha(350, 120, {
 *   captcha: { characters: 8, size: 45 },
 *   trace: { color: '#95a5a6', size: 4, opacity: 0.8 },
 *   decoy: { total: 50, opacity: 0.3, size: 18 }
 * });
 * ```
 * 
 * @example With background image
 * ```typescript
 * import { resolveImage } from 'captcha-canvas';
 * 
 * const background = await resolveImage('./noise-pattern.jpg');
 * const { image, text } = createCaptcha(300, 100, {
 *   background,
 *   captcha: { opacity: 0.9 } // Make text more visible over background
 * });
 * ```
 * 
 * @example Web server integration
 * ```typescript
 * app.get('/captcha', async (req, res) => {
 *   const { image, text } = createCaptcha(300, 100);
 *   
 *   // Store solution in session for verification
 *   req.session.captchaSolution = text;
 *   
 *   const buffer = await image;
 *   res.type('png').send(buffer);
 * });
 * ```
 */
export function createCaptcha(width: number, height: number, option: CreateCaptchaOptions = {}): CaptchaValue {
    const captcha = new Captcha(width, height);
    const decoyCount = Math.floor(width*height/2500);

    if(!option.decoy) option.decoy = {};
    if(!option.decoy.total) option.decoy.total = decoyCount;

    captcha.addDecoy(option.decoy);

    
    captcha.drawCaptcha(option.captcha);

    captcha.drawTrace(option.trace);

    captcha.addDecoy({ opacity: 1 });

    return { image: captcha.png as Promise<Buffer>, text: captcha.text };
}
/**
 * Creates a CAPTCHA image synchronously without async/await requirements.
 * 
 * This function provides the same functionality as `createCaptcha()` but operates
 * synchronously, making it suitable for use cases where async operations are not
 * desired or possible. Note that background images must be pre-loaded using `resolveImage()`.
 * 
 * @param width - Width of the CAPTCHA image in pixels
 * @param height - Height of the CAPTCHA image in pixels
 * @param option - Optional configuration for customizing CAPTCHA appearance and security
 * @returns Object containing the image buffer and solution text
 * 
 * @example Basic synchronous generation
 * ```typescript
 * import { createCaptchaSync } from 'captcha-canvas';
 * import fs from 'fs';
 * 
 * const { image, text } = createCaptchaSync(300, 100);
 * fs.writeFileSync('captcha.png', image);
 * console.log('Solution:', text);
 * ```
 * 
 * @example Custom configuration
 * ```typescript
 * const { image, text } = createCaptchaSync(400, 150, {
 *   captcha: {
 *     text: 'VERIFY',
 *     size: 55,
 *     rotate: 20,
 *     colors: ['#e74c3c', '#f39c12']
 *   },
 *   trace: { size: 3, opacity: 0.7 },
 *   decoy: { total: 30, opacity: 0.25 }
 * });
 * ```
 * 
 * @example With pre-loaded background
 * ```typescript
 * import { resolveImage } from 'captcha-canvas';
 * 
 * // Pre-load background image
 * const background = await resolveImage('./texture.png');
 * 
 * // Generate synchronously
 * const { image, text } = createCaptchaSync(300, 100, {
 *   background,
 *   captcha: { characters: 6, opacity: 0.85 }
 * });
 * ```
 * 
 * @example Non-async context usage
 * ```typescript
 * function generateCaptchaForForm() {
 *   const { image, text } = createCaptchaSync(250, 80, {
 *     captcha: { characters: 5, size: 35 }
 *   });
 *   
 *   return {
 *     imageBuffer: image,
 *     solution: text,
 *     timestamp: Date.now()
 *   };
 * }
 * ```
 * 
 * @example Batch generation
 * ```typescript
 * function generateMultipleCaptchas(count: number) {
 *   const captchas = [];
 *   
 *   for (let i = 0; i < count; i++) {
 *     const { image, text } = createCaptchaSync(300, 100);
 *     captchas.push({ image, text, id: i });
 *   }
 *   
 *   return captchas;
 * }
 * ```
 */
export function createCaptchaSync(width: number, height: number, option: CreateCaptchaOptions = {}): CaptchaValueSync {
    const captcha = new Captcha(width, height);
    const decoyCount = Math.floor(width*height/2500);
    captcha.async = false;

    if(!option.decoy) option.decoy = {};
    if(!option.decoy.total) option.decoy.total = decoyCount;

    captcha.addDecoy(option.decoy);

    
    captcha.drawCaptcha(option.captcha);

    captcha.drawTrace(option.trace);

    captcha.addDecoy({ opacity: 1 });

    return { image: captcha.png as Buffer, text: captcha.text };
}
