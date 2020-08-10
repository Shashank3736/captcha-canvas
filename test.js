const Captcha = require('./');
const fs = require('fs');

const captcha = new Captcha()

fs.writeFileSync(`./captcha/default.png`, captcha.create())
