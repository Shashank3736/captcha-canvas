"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var captcha_1 = require("./captcha");
var util_1 = require("./util");
/**
 * Captcha Generator.
 */
var CaptchaGenerator = /** @class */ (function (_super) {
    __extends(CaptchaGenerator, _super);
    /**
     * Initatiates the creation of captcha image generation.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600});
     * @param {object} options Options for constructor.
     * @param {integer} options.height Height of captcha image.
     * @param {integer} options.width Width of captcha image.
     * @since 2.0.0
     */
    function CaptchaGenerator(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options.width || 300, options.height || 100) || this;
    }
    Object.defineProperty(CaptchaGenerator.prototype, "text", {
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
    CaptchaGenerator.prototype.setCaptcha = function (captchaOption) {
        this._captcha = __assign(__assign({}, this._captcha), captchaOption);
        if (captchaOption.text)
            this._captcha.characters = captchaOption.text.length;
        if (!captchaOption.text && captchaOption.characters)
            this._captcha.text = (0, util_1.randomText)(captchaOption.characters);
        return this;
    };
    /**
     * set dimension for your captcha image
     * @param {number} height Height of captcha image.
     * @param {number} width Width of captcha image.
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
        this._width = width;
        this._height = height;
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
    CaptchaGenerator.prototype.setTrace = function (traceOption) {
        this._trace = __assign(__assign({}, this._trace), traceOption);
        return this;
    };
    /**
     * Change decoy options
     * @param {SetDecoyOptions} options Decoy characters customisation options
     * @since 2.0.0
     */
    CaptchaGenerator.prototype.setDecoy = function (decoyOption) {
        this._decoy = __assign(__assign({}, this._decoy), decoyOption);
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
            var canvas, ctx, image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = new skia_canvas_1.Canvas(this._width, this._height);
                        ctx = canvas.getContext("2d");
                        ctx.lineJoin = 'miter';
                        ctx.textBaseline = 'middle';
                        this._canvas = canvas;
                        this._ctx = ctx;
                        this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, this._captcha.characters || 6);
                        if (!this.background) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, skia_canvas_1.loadImage)(this.background)];
                    case 1:
                        image = _a.sent();
                        this.drawImage(image);
                        _a.label = 2;
                    case 2:
                        if (this._decoy.opacity)
                            this.addDecoy();
                        if (this._trace.opacity)
                            this.drawTrace();
                        if (this._captcha.opacity)
                            this.drawCaptcha();
                        return [2 /*return*/, this._canvas.png];
                }
            });
        });
    };
    /**
     * Non asynchronous method to generate captcha image.
     * > Note: It do not use `setBackground` method value for background image. If you want to set background
     * and also use generateSync method then use background option in genrateSync method.
     * @param {Image} [background] Add background image.
     * @example
     * const { CaptchaGenerator, resolveImage } = require("captcha-canvas");
     * const fs = require("fs");
     * const img = await resolveImage("./path/to/file");
     *
     * const captcha = new CaptchaGenerator()
     * .generateSync(background: img);
     *
     * fs.writeFileSync("image.png", captcha);
     * @since 2.2.0
     * @returns {Buffer}
     */
    CaptchaGenerator.prototype.generateSync = function (background) {
        var canvas = new skia_canvas_1.Canvas(this._width, this._height);
        canvas.async = false;
        var ctx = canvas.getContext("2d");
        ctx.lineJoin = 'miter';
        ctx.textBaseline = 'middle';
        this._canvas = canvas;
        this._ctx = ctx;
        this.async = false;
        this._coordinates = (0, util_1.getRandomCoordinate)(this._height, this._width, this._captcha.characters || 6);
        if (background)
            this.drawImage(background);
        if (this._decoy.opacity)
            this.addDecoy();
        if (this._trace.opacity)
            this.drawTrace();
        if (this._captcha.opacity)
            this.drawCaptcha();
        return this._canvas.png;
    };
    return CaptchaGenerator;
}(captcha_1.Captcha));
exports.CaptchaGenerator = CaptchaGenerator;
