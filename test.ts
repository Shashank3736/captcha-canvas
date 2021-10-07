import { writeFileSync } from "fs";
import { CaptchaGenerator } from "./js-script";

const captcha = new CaptchaGenerator();
console.log(__filename + captcha.text);
writeFileSync('assets/CaptchaGenerator/' + captcha.text + 'captcha.png', captcha.generateSync());

console.log(captcha.text);
