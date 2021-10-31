"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Captcha = exports.CaptchaGenerator = exports.version = void 0;
exports.version = require(`${__dirname}/../package.json`).version;
var captcha_1 = require("./captcha");
Object.defineProperty(exports, "CaptchaGenerator", { enumerable: true, get: function () { return captcha_1.CaptchaGenerator; } });
Object.defineProperty(exports, "Captcha", { enumerable: true, get: function () { return captcha_1.Captcha; } });
