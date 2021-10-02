declare module "captcha-canvas" {
    import { Canvas, CanvasRenderingContext2D, Image, loadImage } from "skia-canvas";
    export const version: string;
    interface SetCaptchaOptions {
        characters?: number;
        text?: string;
        color?: string;
        font?: string;
        skew?: boolean;
        colors?: string[];
        rotate?: number;
        size?: number;
        opacity?: number;
    }
    interface SetTraceOptions {
        color?: string;
        size?: number;
        opacity?: number;
    }
    interface SetDecoyOptions {
        color?: string;
        font?: string;
        size?: number;
        opacity?: number;
    }

    /**
     * Initatiates the creation of captcha image generation.
     */
    export class Captcha {
        constructor(width?: number, height?: number);
        protected _height: number;
        protected _width: number;
        protected _captcha: SetCaptchaOptions;
        protected _trace: SetTraceOptions;
        protected _decoy: SetDecoyOptions;
        protected _canvas: Canvas;
        protected _ctx: CanvasRenderingContext2D;
        protected _coordinates: number[][];
        public async: Boolean;

        public text: string;

        public png: Buffer;
        public drawImage(image: Image): Captcha;
        public addDecoy(decoyOption: SetDecoyOptions = {}): Captcha;
        public drawCaptcha(captchaOption: SetCaptchaOptions = {}): Captcha;
    }
    export class CaptchaGenerator extends Captcha {
        constructor(options?: {height?: number, width?: number})
        /**
         * Set background for captcha image.
         * @param image Buffer/url/path of image.
         */
        public setBackgroud(image: Buffer | string): CaptchaGenerator;
        /**
         * Change decoy options
         * @param options Decoy characters customisation options
         */
        public setDecoy(options: SetDecoyOptions): CaptchaGenerator;
        /**
         * Change trace creation options.
         * @param options Trace Line appearance options.
         */
        public setTrace(options: SetTraceOptions): CaptchaGenerator;
        /**
         * Change captcha text options
         * @param options Captcha appearance options.
         */
        public setCaptcha(options: SetCaptchaOptions): CaptchaGenerator;
        /**
         * set dimension for your captcha image
         * @param height Height of captcha image.
         * @param width Width of captcha image.
         */
        public setDimension(height: number, width: number): CaptchaGenerator;
        /**
         * Method which returns image buffer
         */
        public generate(): Promise<Buffer>;
        /**
         * Non asynchronous method to generate captcha image.
         * @description It do not use setBackground method value for background image. If you want to set background and also use generateSync method then use background option in genrateSync method.
         */
        public generateSync(background?: Image): Buffer;
    }
}
