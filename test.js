const Captcha = require('./');
const fs = require('fs');

const captcha = new Captcha()

fs.writeFileSync(`./assets/captcha/default.png`, captcha.create())
//fs.writeFileSync('./assets/captcha/default.gif', captcha.createGif())
