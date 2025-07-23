"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Captcha = void 0;
const skia_canvas_1 = require("skia-canvas");
const constants_1 = require("./constants");
const util_1 = require("./util");
/**
 * Captcha Generator
 */
class Captcha {
    /**
     * Start captcha image creation.
     * @param {number} [width] Width of captcha image.
     * @param {number} [height] Height of captcha image.
     * @param {number} [characters] Size of captcha text.
     * @constructor
     */
    constructor(width, height, characters) {
        var _a;
        if (width === void 0) { width = constants_1.defaultDimension.width; }
        if (height === void 0) { height = constants_1.defaultDimension.height; }
        if (characters === void 0) { characters = (_a = constants_1.defaultCaptchaOption.characters) !== null && _a !== void 0 ? _a : 6; }
        this._height = height;
        this._width = width;
        this._captcha = { ...constants_1.defaultCaptchaOption, characters: characters };
        this._trace = constants_1.defaultTraceOptions;
        this._decoy = constants_1.defaultDecoyOptions;
        const canvas = new skia_canvas_1.Canvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.lineJoin = 'miter';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        this._canvas = canvas;
        this._ctx = ctx;
        this.async = true;
        this._coordinates = [];
        this._canvas.gpu = false;
    }
    /**
     * Get Captcha text.
     * @returns {string} Get captcha text.
     */
    get text() {
        return this._captcha.text || "";
    }
    /**
     * Get png image of captcha.
     * @returns {Buffer | Promise<Buffer>} Get png image of captcha created.
     */
    get png() {
        if (this.async) {
            return this._canvas.toBuffer('png');
        }
        else {
            return this._canvas.toBufferSync('png');
        }
    }
    /**
     * Draw image on your captcha.
     * @param {Image} image Choose image you want to add.
     * @returns {Captcha}
     */
    drawImage(image) {
        this._ctx.drawImage(image, 0, 0, this._width, this._height);
        return this;
    }
    /**
     * Add decoy on your captcha image.
     * @param {SetDecoyOptions} [decoyOption] Decoy option you want to customise
     * @returns {Captcha}
     */
    addDecoy(decoyOption = {}) {
        var _a, _b;
        const option = { ...this._decoy, ...decoyOption };
        if (!option.total)
            option.total = Math.floor(this._width * this._height / 10000);
        const decoyText = (0, util_1.randomText)(option.total);
        this._ctx.font = `${option.size}px ${option.font}`;
        this._ctx.globalAlpha = ((_a = option.opacity) !== null && _a !== void 0 ? _a : constants_1.defaultDecoyOptions.opacity);
        this._ctx.fillStyle = ((_b = option.color) !== null && _b !== void 0 ? _b : constants_1.defaultDecoyOptions.color);
        for (const element of decoyText) {
            this._ctx.fillText(element, (0, util_1.getRandom)(30, this._width - 30), (0, util_1.getRandom)(30, this._height - 30));
        }
        return this;
    }
    /**
     * Draw trace line over your captcha.
     *
     * Note: If you want to use custom text or change size of captcha text then drawCaptcha before drawTrace.
     * @param {SetTraceOptions} [traceOption]
     * @returns {Captcha}
     */
    drawTrace(traceOption = {}) {
        var _a, _b, _c;
        const option = { ...this._trace, ...traceOption };
        if (!this._coordinates[0])
            this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, this._captcha.characters || 6);
        const coordinates = this._coordinates;
        this._ctx.strokeStyle = ((_a = option.color) !== null && _a !== void 0 ? _a : constants_1.defaultTraceOptions.color);
        this._ctx.globalAlpha = ((_b = option.opacity) !== null && _b !== void 0 ? _b : constants_1.defaultTraceOptions.opacity);
        this._ctx.beginPath();
        this._ctx.moveTo(coordinates[0][0], coordinates[0][1]);
        this._ctx.lineWidth = ((_c = option.size) !== null && _c !== void 0 ? _c : constants_1.defaultTraceOptions.size);
        for (let i = 1; i < coordinates.length; i++) {
            this._ctx.lineTo(coordinates[i][0], coordinates[i][1]);
        }
        this._ctx.stroke();
        return this;
    }
    /**
     * Draw captcha text on captcha image.
     * @param {DrawCaptchaOption} [captchaOption]
     * @returns {Captcha}
     */
    drawCaptcha(captchaOption = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (Array.isArray(captchaOption)) {
            let text = "";
            for (const option of captchaOption) {
                if (!option.text)
                    throw new Error("Each captcha option in array must have a text property.");
                text += option.text;
            }
            this._captcha.text = text;
            this._captcha.characters = text.length;
            if (!this._coordinates[0])
                this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, this._captcha.characters || 6);
            const coordinates = this._coordinates;
            let charIndex = 0;
            for (const option of captchaOption) {
                const text = option.text || "";
                for (let i = 0; i < text.length; i++) {
                    this._ctx.save();
                    this._ctx.translate(coordinates[charIndex][0], coordinates[charIndex][1]);
                    this._ctx.font = `${option.size}px ${option.font}`;
                    this._ctx.globalAlpha = ((_a = option.opacity) !== null && _a !== void 0 ? _a : constants_1.defaultCaptchaOption.opacity);
                    this._ctx.fillStyle = ((_b = option.color) !== null && _b !== void 0 ? _b : constants_1.defaultCaptchaOption.color);
                    if (option.skew) {
                        this._ctx.transform(1, Math.random(), (0, util_1.getRandom)(20) / 100, 1, 0, 0);
                    }
                    if (option.rotate && option.rotate > 0) {
                        this._ctx.rotate((0, util_1.getRandom)(-option.rotate, option.rotate) * Math.PI / 180);
                    }
                    if (option.colors && ((_c = option.colors) === null || _c === void 0 ? void 0 : _c.length) >= 2) {
                        this._ctx.fillStyle = option.colors[(0, util_1.getRandom)(option.colors.length - 1)];
                    }
                    this._ctx.fillText(text[i], 0, 0);
                    this._ctx.restore();
                    charIndex++;
                }
            }
        }
        else {
            const option = { ...this._captcha, ...captchaOption };
            if (captchaOption.text)
                option.text = captchaOption.text;
            if (!option.text)
                option.text = (0, util_1.randomText)(((_d = option.characters) !== null && _d !== void 0 ? _d : constants_1.defaultCaptchaOption.characters));
            if (option.text.length != option.characters) {
                if (captchaOption.text) {
                    throw new Error("Size of text and no. of characters is not matching.");
                }
                else {
                    option.text = (0, util_1.randomText)(((_e = option.characters) !== null && _e !== void 0 ? _e : constants_1.defaultCaptchaOption.characters));
                }
            }
            this._captcha = option;
            if (!this._coordinates[0])
                this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, option.characters || 6);
            const coordinates = this._coordinates;
            this._ctx.font = `${option.size}px ${option.font}`;
            this._ctx.globalAlpha = ((_f = option.opacity) !== null && _f !== void 0 ? _f : constants_1.defaultCaptchaOption.opacity);
            this._ctx.fillStyle = ((_g = option.color) !== null && _g !== void 0 ? _g : constants_1.defaultCaptchaOption.color);
            for (let n = 0; n < coordinates.length; n++) {
                this._ctx.save();
                this._ctx.translate(coordinates[n][0], coordinates[n][1]);
                if (option.skew) {
                    this._ctx.transform(1, Math.random(), (0, util_1.getRandom)(20) / 100, 1, 0, 0);
                }
                if (option.rotate && option.rotate > 0) {
                    this._ctx.rotate((0, util_1.getRandom)(-option.rotate, option.rotate) * Math.PI / 180);
                }
                if (option.colors && ((_h = option.colors) === null || _h === void 0 ? void 0 : _h.length) >= 2) {
                    this._ctx.fillStyle = option.colors[(0, util_1.getRandom)(option.colors.length - 1)];
                }
                this._ctx.fillText(option.text[n], 0, 0);
                this._ctx.restore();
            }
        }
        return this;
    }
}
exports.Captcha = Captcha;
