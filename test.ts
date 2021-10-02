import { writeFileSync } from "fs";
import { CaptchaGenerator } from "./js-script";

const captcha = new CaptchaGenerator({
    height: 500,
    width: 500
});

writeFileSync(captcha.text + 'captcha.png', captcha.generateSync());