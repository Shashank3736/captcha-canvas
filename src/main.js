const crypto = require('crypto');
const merge = require("deepmerge");
const { 
    defaultCaptchaOptions, 
    defaultTraceOptions, 
    SetTraceOptions, 
    SetDecoyOptions, 
    defaultDecoyOptions,
    SetCaptchaOptions,
} = require("./constants");
const { createCanvas, loadImage, Image } = require("canvas");
function getRandom(n) {
    return Math.floor(Math.random()*(n - 60)) + 30
}
/**
 * Captcha Generator
 */
class CaptchaGenerator {
    /**
     * Initatiates the creation of captcha image generation.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600});
     * @param {object} options Options for constructor.
     * @param {integer} options.height Height of captcha image.
     * @param {integer} options.width Width of captcha image.
     * @since 2.0.0
     */
    constructor(options = {}) {
        /**
         * Height of captcha image
         * @type {Number}
         * @private
         */
        this.height = options.height || 100;
        /**
         * Get width of captcha image
         * @type {Number}
         * @private
         */
        this.width = options.width || 300;
        /**
         * Captcha Text option for the image
         * @type {SetCaptchaOptions}
         * @private
         */
        this.captcha = defaultCaptchaOptions;
        /**
         * Trace line option for the image
         * @type {SetTraceOptions}
         * @private
         */
        this.trace = defaultTraceOptions;
        /**
         * Decoy characters option for image
         * @type {SetDecoyOptions}
         * @private
         */
        this.decoy = defaultDecoyOptions;
        /**
         * Captch text randomly created here.
         * @type {string}
         * @private
         */
        this.captcha.text = crypto.randomBytes(32).toString("hex").toUpperCase().replace(/[^a-z]/gi, "");
    }
    /**
     * Get the text of captcha.
     * @type {string}
     * @since 2.0.3
     */
    get text() {
        return this.captcha.text.substr(0, this.captcha.characters);;
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
    setCaptcha(options) {
        this.captcha = merge(this.captcha, options);
        if(options.text) this.captcha.characters = options.text.length
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
    setTrace(options) {
        this.trace = merge(this.trace, options);
        return this;
    }
    /**
     * Change decoy options
     * @param {SetDecoyOptions} options Decoy characters customisation options
     * @since 2.0.0
     */
    setDecoy(options) {
        this.decoy = merge(this.decoy, options);
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
    async generate() {
        /*Create canvas element from createCanvas function*/
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        /*Set line join and text base line here.*/
        ctx.lineJoin = "miter";
        ctx.textBaseline = "middle";
        /*Get coordinates values for captcha text and lines*/
        let coordinates = [];
        /*get coordinates for captcha characters and trace line*/
        for (let i = 0; i < this.captcha.characters; i++) {
            const widthGap = Math.floor(this.width/(this.captcha.characters));
            let coordinate = [];
            let randomWidth = widthGap*(i + 0.2);
            coordinate.push(randomWidth);
            let randomHeight = getRandom(this.height);
            coordinate.push(randomHeight);
            coordinates.push(coordinate);
        }
        coordinates = coordinates.sort((a, b) => a[0] - b[0]);
        /*Adding background in captcha*/
        if(this.background) {
            const background = await loadImage(this.background);
            ctx.drawImage(background, 0, 0, this.width, this.height);
        }
        /*Add decoy text in captcha*/
        if(this.decoy.opacity) {
            const decoyTextCount = Math.floor(this.height*this.width/10000);
            const decoyText = crypto.randomBytes(decoyTextCount).toString('hex').split('');
            ctx.font = `${this.decoy.size}px ${this.decoy.font}`;
            ctx.globalAlpha = this.decoy.opacity;
            ctx.fillStyle = this.decoy.color;
            for(let i = 0; i < decoyText.length; i++) {
                ctx.fillText(decoyText[i], getRandom(this.width), getRandom(this.height))
            }
        }
        /*Add trace line*/
        if(this.trace.opacity) {
            ctx.strokeStyle = this.trace.color;
            ctx.globalAlpha = this.trace.opacity;
            ctx.beginPath();
            ctx.moveTo(coordinates[0][0], coordinates[0][1]);
            ctx.lineWidth = this.trace.size;
            for(let i = 1; i < coordinates.length; i++) {
                ctx.lineTo(coordinates[i][0], coordinates[i][1]);
            }
            ctx.stroke();
        }
        /*Add captcha text*/
        if(this.captcha.opacity) {
            ctx.font = `${this.captcha.size}px ${this.captcha.font}`;
            ctx.globalAlpha = this.captcha.opacity;
            ctx.fillStyle = this.captcha.color;
            for(let n = 0; n < coordinates.length; n++) {
                ctx.fillText(this.captcha.text[n], coordinates[n][0], coordinates[n][1]);
            }
        }
        /*Return buffer*/
        return canvas.toBuffer();
    }
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
    generateSync(options = {}) {
        /*Create canvas element from createCanvas function*/
        const canvas = createCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        /*Set line join and text base line here.*/
        ctx.lineJoin = "miter";
        ctx.textBaseline = "middle";
        /*Get coordinates values for captcha text and lines*/
        let coordinates = [];
        /*get coordinates for captcha characters and trace line*/
        for (let i = 0; i < this.captcha.characters; i++) {
            const widthGap = Math.floor(this.width/(this.captcha.characters));
            let coordinate = [];
            let randomWidth = widthGap*(i + 0.2);
            coordinate.push(randomWidth);
            let randomHeight = getRandom(this.height);
            coordinate.push(randomHeight);
            coordinates.push(coordinate);
        }
        coordinates = coordinates.sort((a, b) => a[0] - b[0]);
        /*Adding background in captcha*/
        if(options.background) {
            ctx.drawImage(options.background, 0, 0, this.width, this.height);
        }
        /*Add decoy text in captcha*/
        if(this.decoy.opacity) {
            const decoyTextCount = Math.floor(this.height*this.width/10000);
            const decoyText = crypto.randomBytes(decoyTextCount).toString('hex').split('');
            ctx.font = `${this.decoy.size}px ${this.decoy.font}`;
            ctx.globalAlpha = this.decoy.opacity;
            ctx.fillStyle = this.decoy.color;
            for(let i = 0; i < decoyText.length; i++) {
                ctx.fillText(decoyText[i], getRandom(this.width), getRandom(this.height))
            }
        }
        /*Add trace line*/
        if(this.trace.opacity) {
            ctx.strokeStyle = this.trace.color;
            ctx.globalAlpha = this.trace.opacity;
            ctx.beginPath();
            ctx.moveTo(coordinates[0][0], coordinates[0][1]);
            ctx.lineWidth = this.trace.size;
            for(let i = 1; i < coordinates.length; i++) {
                ctx.lineTo(coordinates[i][0], coordinates[i][1]);
            }
            ctx.stroke();
        }
        /*Add captcha text*/
        if(this.captcha.opacity) {
            ctx.font = `${this.captcha.size}px ${this.captcha.font}`;
            ctx.globalAlpha = this.captcha.opacity;
            ctx.fillStyle = this.captcha.color;
            for(let n = 0; n < coordinates.length; n++) {
                ctx.fillText(this.captcha.text[n], coordinates[n][0], coordinates[n][1]);
            }
        }
        /*Return buffer*/
        return canvas.toBuffer();
    }
}

module.exports = CaptchaGenerator;
