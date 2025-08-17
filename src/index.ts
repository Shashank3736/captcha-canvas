/**
 * Main entry point for the captcha-canvas library.
 * 
 * This library provides a comprehensive solution for generating secure CAPTCHA images
 * using the skia-canvas module. It offers both simple function-based and advanced
 * class-based APIs for creating customizable CAPTCHAs with various security features.
 * 
 * @example Basic usage with simple functions
 * ```typescript
 * import { createCaptcha } from 'captcha-canvas';
 * 
 * const { image, text } = createCaptcha(300, 100);
 * console.log('CAPTCHA text:', text);
 * // Save the image buffer to file or send to client
 * ```
 * 
 * @example Advanced usage with CaptchaGenerator class
 * ```typescript
 * import { CaptchaGenerator } from 'captcha-canvas';
 * 
 * const captcha = new CaptchaGenerator()
 *   .setDimension(400, 150)
 *   .setCaptcha({ text: 'SECURE', size: 60, color: '#ff6b6b' })
 *   .setTrace({ color: '#4ecdc4', size: 4 });
 * 
 * const buffer = await captcha.generate();
 * console.log('CAPTCHA text:', captcha.text);
 * ```
 * 
 * @author Shashank3736
 * @since 3.3.3
 */

// Simple function-based API for quick CAPTCHA generation
export { createCaptcha, createCaptchaSync } from "./extra";

// Re-export skia-canvas loadImage as resolveImage for convenience
export { loadImage as resolveImage } from "skia-canvas";

// Core classes for advanced CAPTCHA generation
export { Captcha } from "./captcha";
export { CaptchaGenerator } from "./CaptchaGenerator";
