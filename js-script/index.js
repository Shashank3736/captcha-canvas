"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.CaptchaGenerator = exports.Captcha = void 0;
var captcha_1 = require("./captcha");
Object.defineProperty(exports, "Captcha", { enumerable: true, get: function () { return captcha_1.Captcha; } });
var captchaGen_1 = require("./captchaGen");
Object.defineProperty(exports, "CaptchaGenerator", { enumerable: true, get: function () { return captchaGen_1.CaptchaGenerator; } });
exports.version = require(`${__dirname}/../package.json`).version;
