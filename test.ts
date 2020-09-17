import { writeFileSync } from "fs";
import { CaptchaGenerator } from ".";

const captcha:any = new CaptchaGenerator()

writeFileSync("image.png", captcha);