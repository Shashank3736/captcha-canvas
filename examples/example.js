const CaptchaGenerator = require("../src/main");
const fs = require("fs")
/**
 * Let's start with first example
 * we will use the default value without any update
 */

new Promise(async (resolve, reject) => {
    const captcha = new CaptchaGenerator()
    fs.writeFileSync(`./examples/default.png`, await captcha.generate())
    console.log(captcha.text)
})

//with custom dimension (200, 600)
//200 is height here and 600 width

new Promise(async (resolve, reject) => {
    const captcha = new CaptchaGenerator()
    .setDimension(200, 600)
    fs.writeFileSync(`./examples/dimension.png`, await captcha.generate())
    console.log(captcha.text)
})

/**
 * with custom font
 * 
 */
new Promise(async (resolve, reject) => {
    const options = {
        color: "deeppink",
        font: 'Candara',
        size: "60"
    }
    const captcha = new CaptchaGenerator()
    .setCaptcha(options)
    .setDimension(150, 450)
    fs.writeFileSync(`./examples/captcha.png`, await captcha.generate())
    console.log(captcha.text)
})

//using all config

new Promise(async (resolve, reject) => {
    const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setCaptcha({color: "deeppink", size: 60, text: "CUSTOM05"})
    .setDecoy({opacity: 0.5})
    .setTrace({color: "deeppink", size: 5})
    fs.writeFileSync(`./examples/all.png`, await captcha.generate())
    console.log(captcha.text)
})