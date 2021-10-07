"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Captcha = void 0;
var skia_canvas_1 = require("skia-canvas");
var constants_1 = require("./constants");
var util_1 = require("./util");
/**
 * Captcha Generator
 */
var Captcha = /** @class */ (function () {
    /**
     * Start captcha image creation.
     * @param {number} [width] Width of captcha image.
     * @param {number} [height] Height of captcha image.
     * @constructor
     */
    function Captcha(width, height) {
        if (width === void 0) { width = constants_1.defaultDimension.width; }
        if (height === void 0) { height = constants_1.defaultDimension.height; }
        this._height = height;
        this._width = width;
        this._captcha = constants_1.defaultCaptchaOption;
        this._trace = constants_1.defaultTraceOptions;
        this._decoy = constants_1.defaultDecoyOptions;
        var canvas = new skia_canvas_1.Canvas(width, height);
        var ctx = canvas.getContext('2d');
        ctx.lineJoin = 'miter';
        ctx.textBaseline = 'middle';
        this._canvas = canvas;
        this._ctx = ctx;
        this.async = true;
        this._coordinates = [];
    }
    Object.defineProperty(Captcha.prototype, "text", {
        /**
         * Get Captcha text.
         * @returns {string} Get captcha text.
         */
        get: function () {
            return this._captcha.text || "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Captcha.prototype, "png", {
        /**
         * Get png image of captcha.
         * @returns {Buffer} Get png image of captcha created.
         */
        get: function () {
            this._canvas.async = this.async;
            return this._canvas.png;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Draw image on your captcha.
     * @param {Image} image Choose image you want to add.
     * @returns {Captcha}
     */
    Captcha.prototype.drawImage = function (image) {
        this._ctx.drawImage(image, 0, 0);
        return this;
    };
    /**
     * Add decoy on your captcha image.
     * @param {SetDecoyOptions} [decoyOption] Decoy option you want to customise
     * @returns {Captcha}
     */
    Captcha.prototype.addDecoy = function (decoyOption) {
        if (decoyOption === void 0) { decoyOption = {}; }
        var option = __assign(__assign({}, this._decoy), decoyOption);
        if (!option.total)
            option.total = Math.floor(this._width * this._height / 10000);
        var decoyText = (0, util_1.randomText)(option.total);
        this._ctx.font = option.size + "px " + option.font;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.fillStyle = option.color;
        for (var i = 0; i < decoyText.length; i++) {
            this._ctx.fillText(decoyText[i], (0, util_1.getRandom)(30, this._width - 30), (0, util_1.getRandom)(30, this._height - 30));
        }
        return this;
    };
    /**
     * Draw trace line over your captcha.
     *
     * Note: If you want to use custom text or change size of captcha text then drawCaptcha before drawTrace.
     * @param {SetTraceOptions} [traceOption]
     * @returns {Captcha}
     */
    Captcha.prototype.drawTrace = function (traceOption) {
        if (traceOption === void 0) { traceOption = {}; }
        var option = __assign(__assign({}, this._trace), traceOption);
        if (!this._coordinates[0])
            this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, this._captcha.characters || 6);
        var coordinates = this._coordinates;
        this._ctx.strokeStyle = option.color;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.beginPath();
        this._ctx.moveTo(coordinates[0][0], coordinates[0][1]);
        this._ctx.lineWidth = option.size;
        for (var i = 1; i < coordinates.length; i++) {
            this._ctx.lineTo(coordinates[i][0], coordinates[i][1]);
        }
        this._ctx.stroke();
        return this;
    };
    /**
     * Draw captcha text on captcha image.
     * @param {SetCaptchaOptions} [captchaOption]
     * @returns {Captcha}
     */
    Captcha.prototype.drawCaptcha = function (captchaOption) {
        var _a;
        if (captchaOption === void 0) { captchaOption = {}; }
        var option = __assign(__assign({}, this._captcha), captchaOption);
        if (captchaOption.text)
            option.characters = captchaOption.text.length;
        if (!captchaOption.text && captchaOption.characters)
            option.text = (0, util_1.randomText)(option.characters);
        if (!option.text)
            option.text = (0, util_1.randomText)(option.characters);
        this._captcha = option;
        if (!this._coordinates[0])
            this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, option.characters || 6);
        var coordinates = this._coordinates;
        this._ctx.font = option.size + "px " + option.font;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.fillStyle = option.color;
        for (var n = 0; n < coordinates.length; n++) {
            this._ctx.save();
            this._ctx.translate(coordinates[n][0], coordinates[n][1]);
            if (option.skew) {
                this._ctx.transform(1, Math.random(), (0, util_1.getRandom)(20) / 100, 1, 0, 0);
            }
            if (option.rotate > 0) {
                this._ctx.rotate((0, util_1.getRandom)(-option.rotate, option.rotate) * Math.PI / 180);
            }
            if (((_a = option.colors) === null || _a === void 0 ? void 0 : _a.length) > 2) {
                this._ctx.fillStyle = option.colors[(0, util_1.getRandom)(option.colors.length - 1)];
            }
            this._ctx.fillText(option.text[n], 0, 0);
            this._ctx.restore();
        }
        ;
        return this;
    };
    return Captcha;
}());
exports.Captcha = Captcha;
