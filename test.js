"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var js_script_1 = require("./js-script");
var captcha = new js_script_1.CaptchaGenerator()
    .setDimension(200, 200);
console.log(__filename + captcha.text);
(0, fs_1.writeFileSync)('assets/CaptchaGenerator/' + captcha.text + 'captcha.png', captcha.generateSync());
console.log(captcha.text);
