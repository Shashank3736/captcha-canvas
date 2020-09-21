import { Image } from "canvas";

declare module "captcha-canvas" {
    export const version: string;
    export class CaptchaGenerator {
        constructor(options?: {height?: number, width?: number})
        public height: number;
        public width: number;
        public captcha: SetCaptchaOptions;
        public trace: SetTraceOptions;
        public decoy: SetDecoyOptions;

        public setBackgroud(image?: string);
        public setDecoy(SetDecoyOptions);
        public setTrace(SetTraceOptions);
        public setCaptcha(SetCaptchaOptions);
        public setDimension(height?: number, width?: number);
        public generate(): Promise<Buffer>;
        public generateSync(options?: {background?: Image}): Buffer;
    }
    interface SetCaptchaOptions {
        characters?: number;
        text?: string;
        color?: string;
        font?: string;
        size?: number;
        opacity?: number;
    }
    interface SetTraceOptions {
        size?: number;
        color?: string;
        opacity?: number;
    }
    interface SetDecoyOptions {
        color?: string;
        opacity?: number;
        font?: string;
        size?: number;
    }
}