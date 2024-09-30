/// <reference lib="dom" />

import { 
    defaultCaptchaOption, 
    defaultDecoyOptions,
    defaultTraceOptions,
    SetDecoyOption, 
    SetTraceOption, 
    DrawCaptchaOption 
} from "./constants";

import { getRandom, getRandomCoordinate, randomText } from "./util";

/**
 * Constructor options
 * @typedef ConstructorOptions
 * @property {number} [characters=6] Length of captcha text.
 * @property {CanvasRenderingContext2D} ctx
 */
export type ConstructorOptions = { characters?: number, ctx: CanvasRenderingContext2D };

/**
 * Captcha Generator
 */
export class Captcha {
    protected _height: number;
    protected _width: number;
    protected _captcha: typeof defaultCaptchaOption;
    protected _trace: typeof defaultTraceOptions;
    protected _decoy: typeof defaultDecoyOptions;
    protected _ctx: CanvasRenderingContext2D;
    protected _coordinates: number[][];
    public async: boolean;
    /**
     * Start captcha image creation.
     * @param {ConstructorOptions} [option] Size of captcha text.
     * @constructor
     */
    constructor({ 
        characters = defaultCaptchaOption.characters,
        ctx,
    }: ConstructorOptions) {
        this._captcha = defaultCaptchaOption;
        this._captcha.characters = characters;
        this._trace = defaultTraceOptions;
        this._decoy = defaultDecoyOptions;
        ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        this._width = ctx.canvas.width
        this._height = ctx.canvas.height
        this._ctx = ctx;
        this.async = true;
        this._coordinates = [];
    }
    /**
     * Get canvas context.
     * @returns {CanvasRenderingContext2D}
     */
    get context(): CanvasRenderingContext2D {
        return this._ctx;
    }
    /**
     * Get Captcha text.
     * @returns {string} Get captcha text.
     */
    get text(): string {
        return this._captcha.text || "";
    }
    /**
     * Draw image on your captcha.
     * @param {Image} image Choose image you want to add.
     * @returns {Captcha}
     */
    drawImage(image: CanvasImageSource): Captcha {
        this._ctx.drawImage(image, 0, 0, this._width, this._height);
        return this;
    }
    /**
     * Add decoy on your captcha image.
     * @param {SetDecoyOptions} [decoyOption] Decoy option you want to customise
     * @returns {Captcha}
     */
    addDecoy(decoyOption: SetDecoyOption = {}): Captcha {
        const option = { ...this._decoy, ...decoyOption };
        if(!option.total) option.total = Math.floor(this._width * this._height/10000);

        const decoyText = randomText(option.total);
        this._ctx.font = `${option.size}px ${option.font}`;
        this._ctx.globalAlpha = option.opacity;
        this._ctx.fillStyle = option.color;
		for(const element of decoyText) {
			this._ctx.fillText(element, getRandom(30, this._width - 30), getRandom(30, this._height - 30));
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
    drawTrace(traceOption: SetTraceOption = {}): Captcha {
        const option = { ...this._trace, ...traceOption };
        if(!this._coordinates[0]) this._coordinates = getRandomCoordinate(this._height, this._width, this._captcha.characters || 6);
        const coordinates: number[][] = this._coordinates;

        this._ctx.strokeStyle = option.color;
		this._ctx.globalAlpha = option.opacity;

		this._ctx.beginPath();
		this._ctx.moveTo(coordinates[0][0], coordinates[0][1]);
		this._ctx.lineWidth = option.size;
		for(let i = 1; i < coordinates.length; i++) {
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
    drawCaptcha(captchaOption: DrawCaptchaOption = {}): Captcha {
        const option = { ...this._captcha, ...captchaOption };
        if(captchaOption.text) option.text = captchaOption.text;
        if(!option.text) option.text = randomText(option.characters);
        if(option.text.length != option.characters) {
            if(captchaOption.text) {
                throw new Error("Size of text and no. of characters is not matching.");
            }
            else {
                option.text = randomText(option.characters);
            }
        }
        this._captcha = option;

        if(!this._coordinates[0]) this._coordinates = getRandomCoordinate(this._height, this._width, option.characters || 6);
        const coordinates: number[][] = this._coordinates;
        
        this._ctx.font = `${option.size}px ${option.font}`;
		this._ctx.globalAlpha = option.opacity;
		this._ctx.fillStyle = option.color;

		for(let n = 0; n < coordinates.length; n++) {
			this._ctx.save();
			this._ctx.translate(coordinates[n][0], coordinates[n][1]);
			if (option.skew) {this._ctx.transform(1, Math.random(), getRandom(20) / 100, 1, 0, 0);}
			if (option.rotate && option.rotate > 0) {this._ctx.rotate(getRandom(-option.rotate, option.rotate) * Math.PI / 180);}
			if (option.colors && option.colors?.length >= 2) {this._ctx.fillStyle = option.colors[getRandom(option.colors.length - 1)];}
			this._ctx.fillText(option.text[n], 0, 0);
			this._ctx.restore();
        }

        return this;
    }
}
