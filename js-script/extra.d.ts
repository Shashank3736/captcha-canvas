/// <reference types="node" />
import { Image } from "skia-canvas";
import { SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
interface captchaValueSync {
    image: Buffer;
    text: string;
}
interface captchaValue {
    image: Promise<Buffer>;
    text: string;
}
interface CreateCaptchaOptions {
    captcha?: SetCaptchaOption;
    trace?: SetTraceOption;
    decoy?: SetDecoyOption;
    background?: Image;
}
/**
 * Create custom captcha from scratch.
 * @async
 * @param {number} width Width of captcha image.
 * @param {number} height Height of captcha image.
 * @param {string} [text] Captcha text.
 * @returns
 */
export declare function createCaptcha(width: number, height: number, option?: CreateCaptchaOptions): captchaValue;
/**
 * Create captcha in sync mode.
 * @param {number} width captcha image width.
 * @param {number} height captcha image height.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns
 */
export declare function createCaptchaSync(width: number, height: number, option?: CreateCaptchaOptions): captchaValueSync;
export {};
