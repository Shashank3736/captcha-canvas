import { Captcha } from ".";

const captchaValue = {}
interface captchaValueSync {
    image: Buffer,
    text: string
}

interface captchaValue {
    image: Promise<Buffer>,
    text: string
}
/**
 * Create custom captcha from scratch.
 * @async
 * @param {number} width Width of captcha image.
 * @param {number} height Height of captcha image.
 * @param {string} [text] Captcha text.
 * @returns 
 */
export function createCaptcha(width: number, height: number, text?: string): captchaValue {
    const captcha = new Captcha(width, height);
    const decoyCount = Math.floor(width*height/2500);

    captcha.addDecoy({
        total: decoyCount,
        opacity: 1
    });

    if (text) {
        captcha.drawCaptcha({ text: text });
    } else {
        captcha.drawCaptcha();
        text = captcha.text;
    }

    captcha.drawTrace();
    captcha.addDecoy({opacity: 1});

    return { image: captcha.png, text: captcha.text };
};
/**
 * Create captcha in sync mode.
 * @param {number} width captcha image width.
 * @param {number} height captcha image height.
 * @param {string} [text] Captcha text. 
 * @returns 
 */
export function createCaptchaSync(width: number, height: number, text?: string): captchaValueSync {
    const captcha = new Captcha(width, height);
    const decoyCount = Math.floor(width*height/2500);
    captcha.async = false;

    captcha.addDecoy({
        total: decoyCount,
        opacity: 1
    });

    if (text) {
        captcha.drawCaptcha({ text: text });
    } else {
        captcha.drawCaptcha();
        text = captcha.text;
    }

    captcha.drawTrace();
    captcha.addDecoy({opacity: 1});

    return { image: captcha.png, text: captcha.text };
};
