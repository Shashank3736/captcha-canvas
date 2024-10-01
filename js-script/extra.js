"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaptcha = void 0;
const constants_1 = require("./constants");
const util_1 = require("./util");
function drawDecoy(ctx, decoyOption = {}) {
    const option = { ...constants_1.defaultDecoyOptions, ...decoyOption };
    if (!option.total)
        option.total = Math.floor(ctx.canvas.width * ctx.canvas.height / 10000);
    const decoyText = (0, util_1.randomText)(option.total);
    ctx.font = `${option.size}px ${option.font}`;
    ctx.globalAlpha = option.opacity;
    ctx.fillStyle = option.color;
    for (const element of decoyText) {
        ctx.fillText(element, (0, util_1.getRandom)(30, ctx.canvas.width - 30), (0, util_1.getRandom)(30, ctx.canvas.height - 30));
    }
}
function drawTrace(ctx, coordinates, traceOption = {}) {
    const option = { ...constants_1.defaultTraceOptions, ...traceOption };
    ctx.strokeStyle = option.color;
    ctx.globalAlpha = option.opacity;
    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    ctx.lineWidth = option.size;
    for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i][0], coordinates[i][1]);
    }
    ctx.stroke();
}
function drawCaptcha(ctx, coordinates, captchaOption = {}) {
    var _a;
    const option = { ...constants_1.defaultCaptchaOption, ...captchaOption };
    if (captchaOption.text)
        option.text = captchaOption.text;
    if (!option.text || option.text == "")
        option.text = (0, util_1.randomText)(option.characters);
    if (option.text.length != option.characters) {
        if (captchaOption.text) {
            throw new Error("Size of text and no. of characters is not matching.");
        }
        else {
            option.text = (0, util_1.randomText)(option.characters);
        }
    }
    ctx.font = `${option.size}px ${option.font}`;
    ctx.globalAlpha = option.opacity;
    ctx.fillStyle = option.color;
    for (let n = 0; n < coordinates.length; n++) {
        if (option.skew) {
            ctx.transform(1, Math.random(), (0, util_1.getRandom)(20) / 100, 1, 0, 0);
        }
        if (option.rotate && option.rotate > 0) {
            ctx.rotate((0, util_1.getRandom)(-option.rotate, option.rotate) * Math.PI / 180);
        }
        if (option.colors && ((_a = option.colors) === null || _a === void 0 ? void 0 : _a.length) >= 2) {
            ctx.fillStyle = option.colors[(0, util_1.getRandom)(option.colors.length - 1)];
        }
        ctx.fillText(option.text[n], coordinates[n][0], coordinates[n][1]);
    }
    return { text: option.text };
}
/**
 * Create custom captcha from scratch.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns { text: string }
 */
function createCaptcha(option) {
    var _a;
    const width = option.ctx.canvas.width;
    const height = option.ctx.canvas.height;
    const decoyCount = Math.floor(width * height / 2500);
    const coordinates = (0, util_1.getRandomCoordinate)(height, width, ((_a = option.captcha) === null || _a === void 0 ? void 0 : _a.characters) || constants_1.defaultCaptchaOption.characters);
    if (!option.decoy)
        option.decoy = {};
    if (!option.decoy.total)
        option.decoy.total = decoyCount;
    drawDecoy(option.ctx, option.decoy);
    const { text } = drawCaptcha(option.ctx, coordinates, option.captcha);
    drawTrace(option.ctx, coordinates, option.trace);
    drawDecoy(option.ctx, { opacity: 1 });
    return { text };
}
exports.createCaptcha = createCaptcha;
