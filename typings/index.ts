/* eslint no-console: "off" */
/* tslint:disable:no-reference */
/// <reference path="index.d.ts" />

import { CaptchaGenerator } from "captcha-canvas";

/**
 * This code from documentation, for typing check.
 */
const captcha = new CaptchaGenerator()
  .setDimension(150, 450)
  .setCaptcha({ text: "CUSTOM05", size: 60, color: "deeppink" })
  .setDecoy({ opacity: 0.5 });

// Get captcha text
console.log(captcha.text);

// For some reason, you'll want to generate synchronously
console.log(captcha.generateSync());

// For some reason, you'll want to generate asynchronously
captcha.generate().then((buffer) => console.log(buffer));
