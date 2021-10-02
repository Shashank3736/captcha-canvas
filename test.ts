import { writeFileSync } from "fs";
import { CaptchaGenerator, createCaptcha, createCaptchaSync } from "./js-script";

const captcha = createCaptchaSync(300, 100);

writeFileSync('assets/captcha/' + captcha.text + 'captcha.png', captcha.image);