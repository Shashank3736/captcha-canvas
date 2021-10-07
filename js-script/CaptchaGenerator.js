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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaGenerator = void 0;
var skia_canvas_1 = require("skia-canvas");
var _1 = require(".");
var constants_1 = require("./constants");
var util_1 = require("./util");
/**
 * Captcha generator class.
 */
var CaptchaGenerator = /** @class */ (function () {
    /**
     * Initatiates the creation of captcha image generation.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600});
     * @param {object} [options] Options for constructor.
     * @param {integer} [options.height=100] Height of captcha image.
     * @param {integer} [options.width=300] Width of captcha image.
     * @since 2.0.0
     */
    function CaptchaGenerator(options) {
        if (options === void 0) { options = { height: 100, width: 300 }; }
        this.height = options.height;
        this.width = options.width;
        this.captcha = constants_1.defaultCaptchaOption;
        this.trace = constants_1.defaultTraceOptions;
        this.decoy = constants_1.defaultDecoyOptions;
        this.captcha.text = (0, util_1.randomText)(this.captcha.characters);
    }
    Object.defineProperty(CaptchaGenerator.prototype, "text", {
        /**
         * Get the text of captcha.
         * @type {string}
         * @since 2.0.3
         */
        get: function () {
            return this.captcha.text;
        },
        enumerable: false,
        configurable: true
    });
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
    CaptchaGenerator.prototype.setDimension = function (height, width) {
        this.height = height;
        this.width = width;
        return this;
    };
    /**
     * Set background for captcha image.
     * @param {buffer} image Buffer/url/path of image.
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
    CaptchaGenerator.prototype.setBackground = function (image) {
        this.background = image;
        return this;
    };
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
    CaptchaGenerator.prototype.setCaptcha = function (option) {
        this.captcha = __assign(__assign({}, this.captcha), option);
        if (option.text)
            this.captcha.characters = option.text.length;
        if (!option.text && option.characters)
            this.captcha.text = (0, util_1.randomText)(option.characters);
        return this;
    };
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
    CaptchaGenerator.prototype.setTrace = function (option) {
        this.trace = __assign(__assign({}, this.trace), option);
        return this;
    };
    /**
     * Change decoy options
     * @param {SetDecoyOptions} options Decoy characters customisation options
     * @since 2.0.0
     */
    CaptchaGenerator.prototype.setDecoy = function (option) {
        this.decoy = __assign(__assign({}, this.decoy), option);
        return this;
    };
    /**
     * Method which returns image buffer
     * @async
     * @returns {Promise<Buffer>}
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    CaptchaGenerator.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var captchaCanvas, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        captchaCanvas = new _1.Captcha(this.width, this.height);
                        if (!this.background) return [3 /*break*/, 2];
                        _b = (_a = captchaCanvas).drawImage;
                        return [4 /*yield*/, (0, skia_canvas_1.loadImage)(this.background)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 2;
                    case 2:
                        if (this.decoy.opacity)
                            captchaCanvas.addDecoy(this.decoy);
                        if (this.captcha.opacity)
                            captchaCanvas.drawCaptcha(this.captcha);
                        if (this.trace.opacity)
                            captchaCanvas.drawTrace(this.trace);
                        return [2 /*return*/, captchaCanvas.png];
                }
            });
        });
    };
    /**
     * Non asynchronous method to generate captcha image.
     * > Note: It do not use `setBackground` method value for background image. If you want to set background
     * and also use generateSync method then use background option in genrateSync method.
     * @param {object} [options] Options to add extra values
     * @param {Image} [options.background] Add background image.
     * @example
     * const { CaptchaGenerator, resolveImage } = require("captcha-canvas");
     * const fs = require("fs");
     * const img = await resolveImage("./path/to/file");
     *
     * const captcha = new CaptchaGenerator()
     * .generateSync({background: img});
     *
     * fs.writeFileSync("image.png", captcha);
     * @since 2.2.0
     */
    CaptchaGenerator.prototype.generateSync = function (option) {
        if (option === void 0) { option = {}; }
        var captchaCanvas = new _1.Captcha(this.width, this.height);
        captchaCanvas.async = false;
        if (option.background)
            captchaCanvas.drawImage(option.background);
        if (this.decoy.opacity)
            captchaCanvas.addDecoy(this.decoy);
        if (this.captcha.opacity)
            captchaCanvas.drawCaptcha(this.captcha);
        if (this.trace.opacity)
            captchaCanvas.drawTrace(this.trace);
        return captchaCanvas.png;
    };
    return CaptchaGenerator;
}());
exports.CaptchaGenerator = CaptchaGenerator;
