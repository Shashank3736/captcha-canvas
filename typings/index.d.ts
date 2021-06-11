declare module "captcha-canvas" {
    import { Image } from "canvas";
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
    export class CaptchaGenerator {
        constructor(options?: {height?: number, width?: number})
        public height: number;
        public width: number;
        public captcha: SetCaptchaOptions;
        public trace: SetTraceOptions;
        public decoy: SetDecoyOptions;

        /**
         * Get the text of captcha.
         */
        public text: string;

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
        public generateSync(options?: {background?: Image}): Buffer;
    }
}
