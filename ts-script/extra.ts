import { Image } from "skia-canvas";
import { Captcha } from ".";
import { SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";

interface captchaValueSync {
    image: Buffer,
    text: string
}

interface captchaValue {
    image: Promise<Buffer>,
    text: string
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
export function createCaptcha(width: number, height: number, option: CreateCaptchaOptions = {}): captchaValue {
    const captcha = new Captcha(width, height);
    const decoyCount = Math.floor(width*height/2500);

    if(!option.decoy) option.decoy = {};
    if(!option.decoy.total) option.decoy.total = decoyCount;

    captcha.addDecoy(option.decoy);

    
    captcha.drawCaptcha(option.captcha);
    const text = captcha.text;

    captcha.drawTrace(option.trace);

    captcha.addDecoy({ opacity: 1 });

    return { image: captcha.png, text: captcha.text };
};
/**
 * Create captcha in sync mode.
 * @param {number} width captcha image width.
 * @param {number} height captcha image height.
 * @param {CreateCaptchaOptions} [option] Captcha text. 
 * @returns 
 */
export function createCaptchaSync(width: number, height: number, option: CreateCaptchaOptions = {}): captchaValueSync {
    const captcha = new Captcha(width, height);
    const decoyCount = Math.floor(width*height/2500);
    captcha.async = false;

    if(!option.decoy) option.decoy = {};
    if(!option.decoy.total) option.decoy.total = decoyCount;

    captcha.addDecoy(option.decoy);

    
    captcha.drawCaptcha(option.captcha);
    const text = captcha.text;

    captcha.drawTrace(option.trace);

    captcha.addDecoy({ opacity: 1 });

    return { image: captcha.png, text: captcha.text };
};
