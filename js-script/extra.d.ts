import { CreateCaptchaOptions } from "./constants";
/**
 * Create custom captcha from scratch.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns { text: string }
 */
export declare function createCaptcha(option: CreateCaptchaOptions): {
    text: string;
};
