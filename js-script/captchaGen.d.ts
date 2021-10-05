/// <reference types="node" />
import { Image } from "skia-canvas";
import { Captcha } from "./captcha";
import { SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
interface ConstructorOption {
    width?: number;
    height?: number;
}
/**
 * Captcha Generator.
 */
export declare class CaptchaGenerator extends Captcha {
    private background?;
    /**
     * Initatiates the creation of captcha image generation.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600});
     * @param {object} options Options for constructor.
     * @param {integer} options.height Height of captcha image.
     * @param {integer} options.width Width of captcha image.
     * @since 2.0.0
     */
    constructor(options?: ConstructorOption);
    /**
     * Get Captcha text.
     * @returns {string} Get captcha text.
     */
    get text(): string;
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
    setCaptcha(captchaOption: SetCaptchaOption): CaptchaGenerator;
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
    setDimension(height: number, width: number): CaptchaGenerator;
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
    setBackground(image: Buffer | string): CaptchaGenerator;
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
    setTrace(traceOption: SetTraceOption): CaptchaGenerator;
    /**
     * Change decoy options
     * @param {SetDecoyOptions} options Decoy characters customisation options
     * @since 2.0.0
     */
    setDecoy(decoyOption: SetDecoyOption): CaptchaGenerator;
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
    generate(): Promise<Buffer>;
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
    generateSync(background?: Image): Buffer;
}
export {};
