import { Captcha } from ".";
import { CreateCaptchaOptions, defaultCaptchaOption, defaultDecoyOptions, defaultTraceOptions, DrawCaptchaOption, SetDecoyOption, SetTraceOption } from "./constants";
import { getRandom, getRandomCoordinate, randomText } from "./util";

function drawDecoy(ctx: CanvasRenderingContext2D, decoyOption: SetDecoyOption = {}) {
    const option = { ...defaultDecoyOptions, ...decoyOption };
    if(!option.total) option.total = Math.floor(ctx.canvas.width * ctx.canvas.height/10000);
    
    const decoyText = randomText(option.total);
    ctx.font = `${option.size}px ${option.font}`;
    ctx.globalAlpha = option.opacity;
    ctx.fillStyle = option.color;
    for(const element of decoyText) {
        ctx.fillText(element, getRandom(30, ctx.canvas.width - 30), getRandom(30, ctx.canvas.height - 30));
    }
}

function drawTrace(ctx: CanvasRenderingContext2D, coordinates: number[][], traceOption: SetTraceOption = {}) {
    const option = { ...defaultTraceOptions, ...traceOption };

    ctx.strokeStyle = option.color;
    ctx.globalAlpha = option.opacity;

    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    ctx.lineWidth = option.size;
    for(let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i][0], coordinates[i][1]);
    }
    ctx.stroke();
}

function drawCaptcha(ctx: CanvasRenderingContext2D, coordinates: number[][], captchaOption: DrawCaptchaOption = {}) {
    const option = { ...defaultCaptchaOption, ...captchaOption };
    if(captchaOption.text) option.text = captchaOption.text;
    if(!option.text || option.text == "") option.text = randomText(option.characters);
    if(option.text.length != option.characters) {
        if(captchaOption.text) {
            throw new Error("Size of text and no. of characters is not matching.");
        }
        else {
            option.text = randomText(option.characters);
        }
    }
    
    ctx.font = `${option.size}px ${option.font}`;
    ctx.globalAlpha = option.opacity;
    ctx.fillStyle = option.color;

    for(let n = 0; n < coordinates.length; n++) {
        if (option.skew) {ctx.transform(1, Math.random(), getRandom(20) / 100, 1, 0, 0);}
        if (option.rotate && option.rotate > 0) {ctx.rotate(getRandom(-option.rotate, option.rotate) * Math.PI / 180);}
        if (option.colors && option.colors?.length >= 2) {ctx.fillStyle = option.colors[getRandom(option.colors.length - 1)];}
        ctx.fillText(option.text[n], coordinates[n][0], coordinates[n][1]);
    }

    return { text: option.text };
}
/**
 * Create custom captcha from scratch.
 * @param {CreateCaptchaOptions} [option] Captcha text.
 * @returns { text: string }
 */
export function createCaptcha(option: CreateCaptchaOptions) {
    const width = option.ctx.canvas.width;
    const height = option.ctx.canvas.height;
    const decoyCount = Math.floor(width*height/2500);
    const coordinates = getRandomCoordinate(height, width, option.captcha?.characters || defaultCaptchaOption.characters);

    if(!option.decoy) option.decoy = {};
    if(!option.decoy.total) option.decoy.total = decoyCount;

    drawDecoy(option.ctx, option.decoy);

    const { text } = drawCaptcha(option.ctx, coordinates, option.captcha);

    drawTrace(option.ctx, coordinates, option.trace);

    drawDecoy(option.ctx, { opacity: 1 });

    return { text };
}
