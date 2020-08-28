const Captcha = require("./");
const fs = require('fs');

const captcha = new Captcha()
new Promise(async (resolve, reject) => {
    fs.writeFileSync(`./assets/captcha/default.png`, await captcha.generate())
})
//fs.writeFileSync('./assets/captcha/default.gif', captcha.createGif())
