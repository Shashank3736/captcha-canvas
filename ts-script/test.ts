import { CaptchaGenerator } from "./CaptchaGenerator";
import * as fs from "fs";

const captcha = new CaptchaGenerator()
    .setDimension(200, 600)
    .setCaptcha([
        { text: "AB", color: "red", size: 60, font: "Arial" },
        { text: "CD", color: "green", size: 60, font: "Arial" },
    ])
    .setTrace({ color: "deeppink" })
    .setDecoy({ total: 25 });

captcha.generate().then(buffer => {
    fs.writeFileSync("test.png", new Uint8Array(buffer));
    console.log("Captcha generated successfully!");
}).catch(err => {
    console.error(err);
});