const { Canvas, resolveImage } = require("canvas-constructor");
const crypto = require('crypto');
const merge = require("deepmerge");
function getRandom(n) {
    return Math.floor(Math.random()*(n - 60)) + 30
}
class CaptchaGenerator {
    /**
     * Initatiates the creation of captcha image generation. 
     * This class create the captcha image.
     * @example const captcha = new CaptchaGenerator({height: 200, width: 600})
     * @param {object} options 
     */
    constructor(options = {}) {
        /**
         * Get height of captcha
         * @type {Number}
         */
        this.height = options.height || 100;
        /**
         * Get width of captcha image
         * @type {Number}
         */
        this.width = options.width || 300;
        /**
         * Captcha Text option for the image
         * @type {Object}
         */
        this.captcha = {};
        /**
         * Trace line option for the image
         * @type {Object}
         */
        this.trace = {};
        /**
         * Decoy characters option for image
         * @type {Object}
         */
        this.decoy = {};
        /**
         * Length of captcha text
         * @type {Number}
         */
        this.captcha.characters = 6;
        /**
         * Captcha text
         * @type {String}
         */
        this.captcha.text = crypto.randomBytes(32).toString('hex').toUpperCase().replace(/[^a-z]/gi, '')
        .substr(0, this.captcha.characters);
        /**
         * Color of captcha text.
         * @type {ColorCode}
         */
        this.captcha.color = "#32cf7e";
        /**
         * Font of captcha text
         * @type {Font}
         */
        this.captcha.font = "Sans";
        /**
         * Size of captcha text
         * @type {Number}
         */
        this.captcha.size = 40;
        /**
         * Opacity of captcha text 
         * @type {Number}
         */
        this.captcha.opacity = 1;
        /**
         * Color of trace line
         * @type {ColorCode}
         */
        this.trace.color = "#32cf7e";
        /**
         * Size of trace line (basically width)
         * @type {Number}
         */
        this.trace.size = 3;
        /**
         * Opacity of trace line
         * @type {Number}
         */
        this.trace.opacity = 1;
        /**
         * Color of decoy text
         * @type {ColorCode}
         */
        this.decoy.color = "#646566";
        /**
         * Font of decoy text
         * @type {Font}
         */
        this.decoy.font = this.captcha.font;
        /**
         * Size of decoy text
         * @type {Number}
         */
        this.decoy.size = 20;
        /**
         * Opacity of decoy text
         * @type {Number}
         */
        this.decoy.opacity = 0.8;
    }
    /**
     * Get the text of captcha.
     */
    get text() {
        return this.captcha.text;
    }
    /**
     * set dimension for your captcha image
     * @param height integer
     * @param width integer
     * @returns this
     * @example captcha.setDimension(200, 600)
     * captcha.generate() //generate image
     */
    setDimension(height, width) {
        this.height = height;
        this.width = width;
        return this;
    }
    /**
     * Set background for captcha image.
     * @param {buffer || url} image 
     * @returns this
     * @example captcha.setBackground("https://imgur.com/xyz") 
     */
    setBackground(image) {
        this.background = image;
        return this;
    }
    /**
     * Change captcha text options
     * @param {CaptchaTextOptions} options 
     * @returns this
     * @example captcha.setCaptcha({color: "deeppink", text: "custom", size: 45, opacity: 0.85})
     */
    setCaptcha(options) {
        this.captcha = merge(this.captcha, options);
        if(options.text) this.captcha.characters = options.text.length
        return this;
    }
    /**
     * Change trace creation options.
     * @param {SetTraceOptions} options 
     */
    setTrace(options) {
        this.trace = merge(this.trace, options);
        return this;
    }
    /**
     * Change decoy options
     * @param {DecoyOptions} options 
     */
    setDecoy(options) {
        this.decoy = merge(this.decoy, options);
        return this;
    }
    /**
     * Generate image.
     * @param {Boolean?:default = true} buffer 
     * @async
     * @returns Image buffer.
     */
    async generate(buffer=true) {
        const canvas = new Canvas(this.width, this.height)
        .setTextBaseline("middle")
        .setLineJoin("miter")
        let coordinates = []
        //get coordinates for captcha characters and trace line
        for (let i = 0; i < this.captcha.characters; i++) {
            const widhtGap = Math.floor(this.width/(this.captcha.characters));
            let coordinate = [];
            let randomWidth = widhtGap*(i + 0.2);
            coordinate.push(randomWidth);
            let randomHeight = getRandom(this.height);
            coordinate.push(randomHeight);
            coordinates.push(coordinate)
        }
        coordinates = coordinates.sort((a, b) => a[0] - b[0]);
        
        //first we will try to print background image if available
        if(this.background) {
            const background = await resolveImage(this.background);
            canvas.printImage(background, 0, 0, this.width, this.height);
        }
        //now check for decoy status
        if(this.decoy.opacity > 0) {
            const decoyTextCount = Math.floor(this.height*this.width/10000);
            const decoyText = crypto.randomBytes(decoyTextCount).toString('hex').split('');
            canvas.setTextFont(`${this.decoy.size}px ${this.decoy.font}`)
            .setGlobalAlpha(this.decoy.opacity)
            .setColor(this.decoy.color)
            for(let i = 0; i < decoyText.length; i++) {
                canvas.printText(decoyText[i], getRandom(this.width), getRandom(this.height))
            }
        }
        if(this.trace.opacity > 0) {
            canvas.setStroke(this.trace.color)
            .setGlobalAlpha(this.trace.opacity)
            .beginPath().moveTo(coordinates[0][0], coordinates[0][1])
            .setStrokeWidth(this.trace.size)
            for(let i = 1; i < coordinates.length; i++) {
                canvas
                .lineTo(coordinates[i][0], coordinates[i][1])
            }
            canvas.stroke()
        }
        if(this.captcha.opacity > 0) {
            canvas.setTextFont(`${this.captcha.size}px ${this.captcha.font}`)
            .setGlobalAlpha(this.captcha.opacity)
            .setColor(this.captcha.color)
            for(let n = 0; n < coordinates.length; n++) {
                canvas.printText(this.captcha.text[n], coordinates[n][0], coordinates[n][1])
            }
        }
        return canvas.toBuffer();
    }
    /**
     * @TODO add jsdoc generator
     */
}

module.exports = CaptchaGenerator;
