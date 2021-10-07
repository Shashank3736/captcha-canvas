"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaptchaSync = exports.createCaptcha = void 0;
const _1 = require(".");
const captchaValue = {};
/**
 * Create custom captcha from scratch.
 * @async
 * @param {number} width Width of captcha image.
 * @param {number} height Height of captcha image.
 * @param {string} [text] Captcha text.
 * @returns
 */
function createCaptcha(width, height, text) {
    const captcha = new _1.Captcha(width, height);
    const decoyCount = Math.floor(width * height / 2500);
    captcha.addDecoy({
        total: decoyCount,
        opacity: 1
    });
    if (text) {
        captcha.drawCaptcha({ text: text });
    }
    else {
        captcha.drawCaptcha();
        text = captcha.text;
    }
    captcha.drawTrace();
    captcha.addDecoy({ opacity: 1 });
    return { image: captcha.png, text: captcha.text };
}
exports.createCaptcha = createCaptcha;
;
/**
 * Create captcha in sync mode.
 * @param {number} width captcha image width.
 * @param {number} height captcha image height.
 * @param {string} [text] Captcha text.
 * @returns
 */
function createCaptchaSync(width, height, text) {
    const captcha = new _1.Captcha(width, height);
    const decoyCount = Math.floor(width * height / 2500);
    captcha.async = false;
    captcha.addDecoy({
        total: decoyCount,
        opacity: 1
    });
    if (text) {
        captcha.drawCaptcha({ text: text });
    }
    else {
        captcha.drawCaptcha();
        text = captcha.text;
    }
    captcha.drawTrace();
    captcha.addDecoy({ opacity: 1 });
    return { image: captcha.png, text: captcha.text };
}
exports.createCaptchaSync = createCaptchaSync;
;
