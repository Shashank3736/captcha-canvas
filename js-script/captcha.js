"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaGenerator = exports.Captcha = void 0;
const constants_1 = require("./constants");
const util_1 = require("./util");
class Captcha {
    /**
     * Start captcha image creation.
     * @param {"skia-canvas" | "canvas"} canvas Choose the canvas system you want to use.
     * @param {number} [width] Width of captcha image.
     * @param {number} [height] Height of captcha image.
     * @constructor
     */
    constructor(canvas, width = constants_1.defaultDimension.width, height = constants_1.defaultDimension.height) {
        if (canvas === 'skia-canvas') {
            const { Canvas } = require('skia-canvas');
            this._canvas = new Canvas(width, height);
            this._ctx = this._canvas.getContext('2d');
        }
        else if (canvas === 'canvas') {
            const { createCanvas } = require('canvas');
            this._canvas = createCanvas(width, height);
            this._ctx = this._canvas.getContext('2d');
        }
        this._height = height;
        this._width = width;
        this._captcha = constants_1.defaultCaptchaOption;
        this._trace = constants_1.defaultTraceOptions;
        this._decoy = constants_1.defaultDecoyOptions;
        this._coordinates = [];
        this._ctx.lineJoin = 'miter';
        this._ctx.textBaseline = 'middle';
    }
    /**
     * Get Captcha text.
     * @returns {string} Get captcha text.
     */
    get text() {
        return this._captcha.text || "";
    }
    /**
     * Draw image on your captcha.
     * @param {HTMLImageElement} image Choose image you want to add.
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
        const option = { ...this._decoy, ...decoyOption };
        if (!option.total)
            option.total = Math.floor(this._width * this._height / 10000);
        const decoyText = (0, util_1.randomText)(option.total);
        this._ctx.font = `${option.size}px ${option.font}`;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.fillStyle = option.color;
        for (let i = 0; i < decoyText.length; i++) {
            this._ctx.fillText(decoyText[i], (0, util_1.getRandom)(30, this._width - 30), (0, util_1.getRandom)(30, this._height - 30));
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
        const option = { ...this._trace, ...traceOption };
        if (!this._coordinates[0])
            this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, this._captcha.characters || 6);
        const coordinates = this._coordinates;
        this._ctx.strokeStyle = option.color;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.beginPath();
        this._ctx.moveTo(coordinates[0][0], coordinates[0][1]);
        this._ctx.lineWidth = option.size;
        for (let i = 1; i < coordinates.length; i++) {
            this._ctx.lineTo(coordinates[i][0], coordinates[i][1]);
        }
        this._ctx.stroke();
        return this;
    }
    /**
     * Draw captcha text on captcha image.
     * @param {SetCaptchaOptions} [captchaOption]
     * @returns {Captcha}
     */
    drawCaptcha(captchaOption = {}) {
        var _a;
        const option = { ...this._captcha, ...captchaOption };
        if (captchaOption.text)
            option.characters = captchaOption.text.length;
        if (!captchaOption.text && captchaOption.characters)
            option.text = (0, util_1.randomText)(option.characters || 6);
        if (!option.text)
            option.text = (0, util_1.randomText)(option.characters || 6);
        this._captcha = option;
        if (!this._coordinates[0])
            this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, option.characters || 6);
        const coordinates = this._coordinates;
        this._ctx.font = `${option.size}px ${option.font}`;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.fillStyle = option.color;
        for (let n = 0; n < coordinates.length; n++) {
            this._ctx.save();
            this._ctx.translate(coordinates[n][0], coordinates[n][1]);
            if (option.skew) {
                this._ctx.transform(1, Math.random(), (0, util_1.getRandom)(20) / 100, 1, 0, 0);
            }
            if (option.rotate && option.rotate > 0) {
                this._ctx.rotate((0, util_1.getRandom)(-option.rotate, option.rotate) * Math.PI / 180);
            }
            if (option.colors && ((_a = option.colors) === null || _a === void 0 ? void 0 : _a.length) > 2) {
                this._ctx.fillStyle = option.colors[(0, util_1.getRandom)(option.colors.length - 1)];
            }
            this._ctx.fillText(option.text[n], 0, 0);
            this._ctx.restore();
        }
        ;
        return this;
    }
    toBuffer() {
        return this._canvas.toBuffer();
    }
}
exports.Captcha = Captcha;
class CaptchaGenerator {
    /**
     * Initatiates the creation of captcha image generation.
     * @param {"skia-canvas" | "canvas"} canvas Choose the canvas.
     * @param {number} width Set captcha width.
     * @param {number} height Set captcha height.
     * @since 4.0.0
     */
    constructor(canvas, width = constants_1.defaultDimension.width, height = constants_1.defaultDimension.height) {
        this.type = canvas;
        this.height = height;
        this.width = width;
        this.captcha = constants_1.defaultCaptchaOption;
        this.trace = constants_1.defaultTraceOptions;
        this.decoy = constants_1.defaultDecoyOptions;
        this.captcha.text = (0, util_1.randomText)(this.captcha.characters || 6);
    }
    /**
       * Get the text of captcha.
       * @type {string}
       * @since 2.0.3
       */
    get text() {
        return this.captcha.text;
    }
    /**
     * set dimension for your captcha image
     * @param {integer} height Height of captcha image.
     * @param {integer} width Width of captcha image.
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * captcha.setDimension(200, 600);
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    setDimension(height, width) {
        this.height = height;
        this.width = width;
        return this;
    }
    /**
     * Set background for captcha image.
     * @param {HTMLImageElement} image Buffer/url/path of image.
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * captcha.setBackground("./path/toFile");
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    setBackground(image) {
        this.background = image;
        return this;
    }
    /**
     * Change captcha text options
     * @param {SetCaptchaOptions} options Captcha appearance options.
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * const options = {font: "Comic Sans", size: 60}
     * captcha.setCaptcha(options)
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    setCaptcha(option) {
        this.captcha = { ...this.captcha, ...option };
        if (option.text)
            this.captcha.characters = option.text.length;
        if (!option.text && option.characters)
            this.captcha.text = (0, util_1.randomText)(option.characters);
        return this;
    }
    /**
     * Change trace creation options.
     * @param {SetTraceOptions} options Trace Line appearance options.
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * const options = {size: 5, color: "deeppink"}
     * captcha.setTrace(options)
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    setTrace(option) {
        this.trace = { ...this.trace, ...option };
        return this;
    }
    /**
     * Change decoy options
     * @param {SetDecoyOptions} options Decoy characters customisation options
     * @since 2.0.0
     */
    setDecoy(option) {
        this.decoy = { ...this.decoy, ...option };
        return this;
    }
    /**
     * Method which returns image buffer
     * @returns {Promise<Buffer> | Buffer}
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    toBuffer() {
        const captcha = new Captcha(this.type, this.width, this.height);
        if (this.background)
            captcha.drawImage(this.background);
        if (this.decoy.opacity)
            captcha.addDecoy(this.decoy);
        if (this.captcha.opacity)
            captcha.drawCaptcha(this.captcha);
        if (this.trace.opacity)
            captcha.drawTrace(this.trace);
        return captcha.toBuffer();
    }
}
exports.CaptchaGenerator = CaptchaGenerator;
