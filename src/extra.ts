import { Captcha } from ".";
import { CreateCaptchaOptions } from "./constants";

/**
 * Interface for synchronous captcha value containing the image buffer and text
 */
export interface CaptchaValueSync {
    /**
     * The captcha image as a Buffer
     */
    image: Buffer,
    /**
     * The text content of the captcha
     */
    text: string
}

/**
 * Interface for asynchronous captcha value containing the image promise and text
 */
export interface CaptchaValue {
    /**
     * The captcha image as a Promise that resolves to a Buffer
     */
    image: Promise<Buffer>,
    /**
     * The text content of the captcha
     */
    text: string
}

/**
 * Create custom captcha from scratch.
 * @param {number} width Width of captcha image.
 * @param {number} height Height of captcha image.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns
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
 * Create captcha in sync mode.
 * @param {number} width captcha image width.
 * @param {number} height captcha image height.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns
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
