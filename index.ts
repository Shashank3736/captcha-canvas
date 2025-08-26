/**
 * @fileoverview Main entry point for the captcha-canvas library.
 * 
 * This module exports the primary CaptchaGenerator class and utility functions
 * for creating secure, customizable CAPTCHA images in Node.js applications.
 * 
 * @example Basic Import and Usage
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
 * @example With Type Definitions
 * ```typescript
 * import { 
 *   CaptchaGenerator, 
 *   SetCaptchaOptions, 
 *   SetTraceOptions,
 *   resolveImage 
 * } from 'captcha-canvas';
 * 
 * const options: SetCaptchaOptions = {
 *   text: 'SECURE',
 *   color: 'blue',
 *   size: 60
 * };
 * 
 * const captcha = new CaptchaGenerator().setCaptcha(options);
 * ```
 */

import { loadImage } from 'canvas';
import CaptchaGenerator from './src/main';
import { version } from './package.json';

// Re-export interfaces for TypeScript users
export type {
	SetDimensionOption,
	SetCaptchaOptions,
	SetTraceOptions,
	SetDecoyOptions
} from './src/constants';

/**
 * The main CaptchaGenerator class for creating customizable CAPTCHA images.
 * 
 * @example
 * ```typescript
 * const captcha = new CaptchaGenerator({ height: 200, width: 500 });
 * ```
 */
export { CaptchaGenerator };

/**
 * Current version of the captcha-canvas library.
 * 
 * @example
 * ```typescript
 * import { version } from 'captcha-canvas';
 * console.log(`Using captcha-canvas v${version}`);
 * ```
 */
export { version };

/**
 * Utility function for loading images from file paths or URLs.
 * This is a re-export of the loadImage function from the canvas library.
 * 
 * @example Loading background image
 * ```typescript
 * import { resolveImage, CaptchaGenerator } from 'captcha-canvas';
 * 
 * const backgroundImage = await resolveImage('./background.jpg');
 * const captcha = new CaptchaGenerator()
 *   .setCaptcha({ color: 'white', size: 50 });
 * 
 * const buffer = captcha.generateSync({ background: backgroundImage });
 * ```
 */
export { loadImage as resolveImage };