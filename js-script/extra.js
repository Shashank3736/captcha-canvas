"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaptcha = void 0;
const _1 = require(".");
/**
 * Create custom captcha from scratch.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns { text: string }
 */
function createCaptcha(option) {
    const captcha = new _1.Captcha({ ctx: option.ctx });
    const width = option.ctx.canvas.width;
    const height = option.ctx.canvas.height;
    const decoyCount = Math.floor(width * height / 2500);
    if (!option.decoy)
        option.decoy = {};
    if (!option.decoy.total)
        option.decoy.total = decoyCount;
    captcha.addDecoy(option.decoy);
    captcha.drawCaptcha(option.captcha);
    captcha.drawTrace(option.trace);
    captcha.addDecoy({ opacity: 1 });
    return { text: captcha.text };
}
exports.createCaptcha = createCaptcha;
