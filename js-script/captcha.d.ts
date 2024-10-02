/// <reference lib="dom" />
import { defaultCaptchaOption, defaultDecoyOptions, defaultTraceOptions, SetDecoyOption, SetTraceOption, DrawCaptchaOption } from "./constants";
/**
 * Constructor options
 * @typedef ConstructorOptions
 * @property {number} [characters=6] Length of captcha text.
 * @property {CanvasRenderingContext2D} ctx
 */
export declare type ConstructorOptions = {
    characters?: number;
    ctx: CanvasRenderingContext2D;
};
/**
 * Captcha Generator
 */
export declare class Captcha {
    protected _height: number;
    protected _width: number;
    protected _captcha: typeof defaultCaptchaOption;
    protected _trace: typeof defaultTraceOptions;
    protected _decoy: typeof defaultDecoyOptions;
    protected _ctx: CanvasRenderingContext2D;
    protected _coordinates: number[][];
    async: boolean;
    /**
     * Start captcha image creation.
     * @param {ConstructorOptions} [option] Size of captcha text.
     * @constructor
     */
    constructor({ characters, ctx, }: ConstructorOptions);
    /**
     * Get canvas context.
     * @returns {CanvasRenderingContext2D}
     */
    get context(): CanvasRenderingContext2D;
    /**
     * Get Captcha text.
     * @returns {string} Get captcha text.
     */
    get text(): string;
    /**
     * Draw image on your captcha.
     * @param {Image} image Choose image you want to add.
     * @returns {Captcha}
     */
    drawImage(image: CanvasImageSource): Captcha;
    /**
     * Add decoy on your captcha image.
     * @param {SetDecoyOptions} [decoyOption] Decoy option you want to customise
     * @returns {Captcha}
     */
    addDecoy(decoyOption?: SetDecoyOption): Captcha;
    /**
     * Draw trace line over your captcha.
     *
     * Note: If you want to use custom text or change size of captcha text then drawCaptcha before drawTrace.
     * @param {SetTraceOptions} [traceOption]
     * @returns {Captcha}
     */
    drawTrace(traceOption?: SetTraceOption): Captcha;
    /**
     * Draw captcha text on captcha image.
     * @param {DrawCaptchaOption} [captchaOption]
     * @returns {Captcha}
     */
    drawCaptcha(captchaOption?: DrawCaptchaOption): Captcha;
}
