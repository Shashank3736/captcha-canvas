import { Canvas, CanvasRenderingContext2D, Image } from "skia-canvas";
import { defaultCaptchaOption, defaultDecoyOptions, defaultDimension, defaultTraceOptions, SetCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
import { getRandom, getRandomCoordinate, randomText } from "./util";

/**
 * Captcha Generator
 */
export class Captcha {
    protected _height: number;
    protected _width: number;
    protected _captcha: SetCaptchaOption;
    protected _trace: SetTraceOption;
    protected _decoy: SetDecoyOption;
    protected _canvas: Canvas;
    protected _ctx: CanvasRenderingContext2D;
    protected _coordinates: number[][];
    public async: Boolean;
    /**
     * Start captcha image creation.
     * @param {number} [width] Width of captcha image.
     * @param {number} [height] Height of captcha image.
     * @constructor
     */
    constructor(width: number = defaultDimension.width, height: number = defaultDimension.height) {
        this._height = height;
        this._width = width;
        this._captcha = defaultCaptchaOption;
        this._trace = defaultTraceOptions;
        this._decoy = defaultDecoyOptions;
        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';
        this._canvas = canvas;
        this._ctx = ctx;
        this.async = true;
        this._coordinates = [];
    }
    /**
     * Get Captcha text.
     * @returns {string} Get captcha text.
     */
    get text(): string {
        return this._captcha.text || "";
    }
    /**
     * Get png image of captcha.
     * @returns {Buffer} Get png image of captcha created.
     */
    get png(): Buffer {
        this._canvas.async = this.async;
        return this._canvas.png;
    }
    /**
     * Draw image on your captcha.
     * @param {Image} image Choose image you want to add.
     * @returns {Captcha}
     */
    drawImage(image: Image): Captcha {
        this._ctx.drawImage(image, 0, 0);
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
		for(let i = 0; i < decoyText.length; i++) {
			this._ctx.fillText(decoyText[i], getRandom(30, this._width - 30), getRandom(30, this._height - 30));
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
     * @param {SetCaptchaOptions} [captchaOption] 
     * @returns {Captcha}
     */
    drawCaptcha(captchaOption: SetCaptchaOption = {}): Captcha {
        const option = { ...this._captcha, ...captchaOption };
        if(captchaOption.text) option.characters = captchaOption.text.length;
        if(!captchaOption.text && captchaOption.characters) option.text = randomText(option.characters);
        if(!option.text) option.text = randomText(option.characters);
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
			if (option.rotate > 0) {this._ctx.rotate(getRandom(-option.rotate, option.rotate) * Math.PI / 180);}
			if (option.colors?.length > 2) {this._ctx.fillStyle = option.colors[getRandom(option.colors.length - 1)];}
			this._ctx.fillText(option.text[n], 0, 0);
			this._ctx.restore();
        };

        return this;
    }
}
