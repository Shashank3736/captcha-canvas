import { Image, loadImage } from "skia-canvas";
import { Captcha } from ".";
import { defaultCaptchaOption, defaultDecoyOptions, defaultTraceOptions, SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
import { randomText } from "./util";
/**
 * Captcha generator class.
 */
export class CaptchaGenerator {
    private height: number;
    private width: number;
    private captcha: SetCaptchaOption | SetCaptchaOption[];
    private trace: SetTraceOption;
    private decoy: SetDecoyOption;
    private background?: string | Buffer;
    /**
     * Initatiates the creation of captcha image generation.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600});
     * @param {object} [options] Options for constructor.
     * @param {integer} [options.height=100] Height of captcha image.
     * @param {integer} [options.width=300] Width of captcha image.
     * @since 2.0.0
     */
    constructor(options = { height: 100, width: 300 }) {
        this.height = options.height;
        this.width = options.width;
        this.captcha = defaultCaptchaOption;
        this.trace = defaultTraceOptions;
        this.decoy = defaultDecoyOptions;
        if(!Array.isArray(this.captcha)) {
            this.captcha.text = randomText(this.captcha.characters || 6);
        }
    }
    /**
     * Get the text of captcha.
     * @type {string}
     * @since 2.0.3
     */
    get text(): string {
    	if (Array.isArray(this.captcha)) {
    		return this.captcha.map((c) => c.text || "").join("");
    	}
    	return this.captcha.text!;
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
    setDimension(height: number, width: number): CaptchaGenerator {
        this.height = height;
        this.width = width;
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
    setBackground(image: string | Buffer) {
        this.background = image;
        return this;
    }
    /**
     * Change captcha text options
     * @param {SetCaptchaOptions} option Captcha appearance options.
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * const option = {font: "Comic Sans", size: 60}
     * captcha.setCaptcha(option)
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    setCaptcha(option: SetCaptchaOption | SetCaptchaOption[]) {
    	if (Array.isArray(option)) {
    		this.captcha = option.map((o) => ({ ...defaultCaptchaOption, ...o }));
    		for (const o of this.captcha) {
    			if (!o.text)
    				throw new Error(
    					"Each captcha option in array must have a text property."
    				);
    			o.characters = o.text.length;
    		}
    	} else {
    		this.captcha = {
    			...(Array.isArray(this.captcha) ? defaultCaptchaOption : this.captcha),
    			...option,
    		};
    		if (!Array.isArray(this.captcha)) {
    			if (option.text) this.captcha.characters = option.text.length;
    			else if (this.captcha.characters)
    				this.captcha.text = randomText(this.captcha.characters);
    		}
    	}
    	return this;
    }
    /**
     * Change trace creation options.
     * @param {SetTraceOptions} option Trace Line appearance options.
     * @example
     * const { CaptchaGenerator } = require("captcha-canvas");
     * const fs = require("fs")
     * const captcha = new CaptchaGenerator();
     * const option = {size: 5, color: "deeppink"}
     * captcha.setTrace(option)
     * const buffer = await captcha.generate() //generate image
     *
     * fs.writeFileSync("image.png", buffer)
     * @since 2.0.0
     */
    setTrace(option: SetTraceOption) {
        this.trace = { ...this.trace, ...option };
        return this;
    }
    /**
     * Change decoy options
     * @param {SetDecoyOptions} option Decoy characters customisation options
     * @since 2.0.0
     */
    setDecoy(option: SetDecoyOption) {
        this.decoy = { ...this.decoy, ...option };
        return this;
    }
    /**
     * Method which returns image buffer
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
        const captchaCanvas = new Captcha(this.width, this.height);

        if(this.background) captchaCanvas.drawImage(await loadImage(this.background));
        if(this.decoy.opacity) captchaCanvas.addDecoy(this.decoy);
        if(this.captcha) captchaCanvas.drawCaptcha(this.captcha as any);
        if(this.trace.opacity) captchaCanvas.drawTrace(this.trace);
        return captchaCanvas.png;
    }
    /**
     * Non asynchronous method to generate captcha image.
     * > Note: It do not use `setBackground` method value for background image. If you want to set background
     * and also use generateSync method then use background option in genrateSync method.
     * @param {object} [option] Options to add extra values
     * @param {Image} [option.background] Add background image.
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
    generateSync(option: { background?: Image } = {}): Buffer {
        const captchaCanvas = new Captcha(
        	this.width,
        	this.height,
        	Array.isArray(this.captcha)
        		? this.captcha.reduce((acc, val) => acc + (val.characters || 0), 0)
        		: this.captcha.characters
        );
        captchaCanvas.async = false;

        if(option.background) captchaCanvas.drawImage(option.background);
        if(this.decoy.opacity) captchaCanvas.addDecoy(this.decoy);
        if(this.captcha) captchaCanvas.drawCaptcha(this.captcha as any);
        if(this.trace.opacity) captchaCanvas.drawTrace(this.trace);

        return captchaCanvas.png as Buffer;
    }
}