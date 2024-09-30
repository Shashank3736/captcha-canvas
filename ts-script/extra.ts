import { Captcha } from ".";
import { CreateCaptchaOptions } from "./constants";

/**
 * Create custom captcha from scratch.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns { text: string }
 */
export function createCaptcha(option: CreateCaptchaOptions) {
    const captcha = new Captcha({ ctx: option.ctx });
    const width = option.ctx.canvas.width;
    const height = option.ctx.canvas.height;
    const decoyCount = Math.floor(width*height/2500);

    if(!option.decoy) option.decoy = {};
    if(!option.decoy.total) option.decoy.total = decoyCount;

    captcha.addDecoy(option.decoy);

    captcha.drawCaptcha(option.captcha);

    captcha.drawTrace(option.trace);

    captcha.addDecoy({ opacity: 1 });

    return { text: captcha.text };
}
