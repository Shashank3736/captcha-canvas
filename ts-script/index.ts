export { createCaptcha, createCaptchaSync } from "./extra";

export { loadImage as resolveImage } from "skia-canvas";

export { Captcha } from "./captcha";
export { CaptchaGenerator } from "./CaptchaGenerator";
export const version: string = require(`${__dirname}/../package.json`).version;
