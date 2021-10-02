import { Canvas, Image, loadImage } from "skia-canvas";
import { Captcha } from "./captcha";
import { SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
import { getRandomCoordinate, randomText } from "./util";
interface ConstructorOption {
    width?: number;
    height?: number;
}
/**
 * Captcha Generator
 * @extends {Captcha}
 */
export class CaptchaGenerator extends Captcha {
    private background?: Buffer | string;
    /**
     * Initatiates the creation of captcha image generation.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600});
     * @param {object} options Options for constructor.
     * @param {integer} options.height Height of captcha image.
     * @param {integer} options.width Width of captcha image.
     * @since 2.0.0
     */
    constructor(options: ConstructorOption = {}) {
        super(options.width || 300, options.height || 100);
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
    setCaptcha(captchaOption: SetCaptchaOption): CaptchaGenerator {
        this._captcha = { ...this._captcha, ...captchaOption };
        if(captchaOption.text) this._captcha.characters = captchaOption.text.length;
        if(!captchaOption.text && captchaOption.characters) this._captcha.text = randomText(captchaOption.characters);
        return this;
    }
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
    setDimension(height: number, width: number): CaptchaGenerator {
        this._width = width;
        this._height = height;
        return this;
    }
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
    setBackground(image: Buffer | string): CaptchaGenerator {
        this.background = image;
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
    setTrace(traceOption: SetTraceOption): CaptchaGenerator {
        this._trace = { ...this._trace, ...traceOption };
        return this;
    }
    /**
     * Change decoy options
     * @param {SetDecoyOptions} options Decoy characters customisation options
     * @since 2.0.0
     */
    setDecoy(decoyOption: SetDecoyOption): CaptchaGenerator {
        this._decoy = { ...this._decoy, ...decoyOption };
        return this;
    }
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
    async generate(): Promise<Buffer> {
        const canvas = new Canvas(this._width, this._height);
        const ctx = canvas.getContext("2d");
        ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';

        this._canvas = canvas;
        this._ctx = ctx;

        this._coordinates = getRandomCoordinate(this._height, this._width, this._captcha.characters || 6);

        if(this.background) {
            const image = await loadImage(this.background);
            this.drawImage(image);
        }

        if(this._decoy.opacity) this.addDecoy();
        if(this._trace.opacity) this.drawTrace();
        if(this._captcha.opacity) this.drawCaptcha();

        return this._canvas.png;
    }
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
    generateSync(background?: Image): Buffer {
        const canvas = new Canvas(this._width, this._height);
        canvas.async = false
        const ctx = canvas.getContext("2d");
        ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';

        this._canvas = canvas;
        this._ctx = ctx;

        this.async = false;
        this._coordinates = getRandomCoordinate(this._height, this._width, this._captcha.characters || 6);
        if(background) this.drawImage(background);
        if(this._decoy.opacity) this.addDecoy();
        if(this._trace.opacity) this.drawTrace();
        if(this._captcha.opacity) this.drawCaptcha();

        return this._canvas.png;
    }
}
