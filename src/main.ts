import { randomBytes } from 'crypto';
import { merge } from './util';
import {
	defaultCaptchaOptions,
	defaultTraceOptions,
	SetTraceOptions,
	SetDecoyOptions,
	defaultDecoyOptions,
	SetCaptchaOptions,
	SetDimensionOption,
} from './constants';
import { createCanvas, loadImage, Image } from 'canvas';

const PD = 30;

function getRandom(start: number, end: number): number {
	start = start || 0;
	end = end || 0;
	return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
}

class CaptchaGenerator {
	private height: number;
	private width: number;
	private captcha: SetCaptchaOptions;
	private trace: SetTraceOptions;
	private decoy: SetDecoyOptions;
	private background?: Buffer | string;
	private captchaSegments: SetCaptchaOptions[] = [];

	constructor(options: SetDimensionOption = {}) {
		this.height = options.height || 100;
		this.width = options.width || 300;
		this.captcha = defaultCaptchaOptions;
		this.trace = defaultTraceOptions;
		this.decoy = defaultDecoyOptions;
		this.captcha.text = randomBytes(32)
			.toString('hex')
			.toUpperCase()
			.replace(/[^a-z]/gi, '')
			.substr(0, this.captcha.characters);
	}

	get text(): string {
		return this.captcha.text || '';
	}

	setDimension(height: number, width: number): this {
		this.height = height;
		this.width = width;
		return this;
	}

	setBackground(image: Buffer | string): this {
		this.background = image;
		return this;
	}

	setCaptcha(options: SetCaptchaOptions | SetCaptchaOptions[]): this {
		if (Array.isArray(options)) {
			this.captchaSegments = options;
			const textFromSegments = options.map(opt => opt.text).filter(Boolean).join('');
			if (textFromSegments) {
				this.captcha.text = textFromSegments;
				this.captcha.characters = textFromSegments.length;
			} else if (!this.captcha.text || !this.captcha.characters) {
				this.captcha.characters = this.captcha.characters || defaultCaptchaOptions.characters;
				this.captcha.text = randomBytes(32)
					.toString('hex')
					.toUpperCase()
					.replace(/[^a-z]/gi, '')
					.substr(0, this.captcha.characters);
			}

		} else {
			this.captchaSegments = [options];
			this.captcha = merge(this.captcha, options) as SetCaptchaOptions;
			if (options.text) this.captcha.characters = options.text.length;
			if (!options.text && options.characters) {
				this.captcha.text = randomBytes(32)
					.toString('hex')
					.toUpperCase()
					.replace(/[^a-z]/gi, '')
					.substr(0, options.characters);
			}
		}
		return this;
	}

	setTrace(options: SetTraceOptions): this {
		this.trace = merge(this.trace, options) as SetTraceOptions;
		return this;
	}

	setDecoy(options: SetDecoyOptions): this {
		this.decoy = merge(this.decoy, options) as SetDecoyOptions;
		return this;
	}

	async generate(): Promise<Buffer> {
		const canvas = createCanvas(this.width, this.height);
		const ctx = canvas.getContext('2d');
		ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';

		let coordinates: number[][] = [];
		if (!this.captcha.characters) this.captcha.characters = 0;
		for (let i = 0; i < this.captcha.characters; i++) {
			const widthGap = Math.floor(this.width / (this.captcha.characters || 1));
			const coordinate: number[] = [];
			const randomWidth = widthGap * (i + 0.2);
			coordinate.push(randomWidth);
			const randomHeight = getRandom(PD, this.height - PD);
			coordinate.push(randomHeight);
			coordinates.push(coordinate);
		}
		coordinates = coordinates.sort((a, b) => a[0] - b[0]);

		if (this.background) {
			const background = await loadImage(this.background);
			ctx.drawImage(background, 0, 0, this.width, this.height);
		}

		if (this.decoy.opacity) {
			const decoyTextCount = Math.floor((this.height * this.width) / 10000);
			const decoyText = randomBytes(decoyTextCount).toString('hex').split('');
			ctx.font = `${this.decoy.size}px ${this.decoy.font}`;
			ctx.globalAlpha = this.decoy.opacity;
			ctx.fillStyle = this.decoy.color || '#000000';
			for (let i = 0; i < decoyText.length; i++) {
				ctx.fillText(
					decoyText[i],
					getRandom(PD, this.width - PD),
					getRandom(PD, this.height - PD)
				);
			}
		}

		if (this.trace.opacity) {
			ctx.strokeStyle = this.trace.color || '#000000';
			ctx.globalAlpha = this.trace.opacity;
			ctx.beginPath();
			ctx.moveTo(coordinates[0][0], coordinates[0][1]);
			ctx.lineWidth = this.trace.size || 1;
			for (let i = 1; i < coordinates.length; i++) {
				ctx.lineTo(coordinates[i][0], coordinates[i][1]);
			}
			ctx.stroke();
		}

		if (this.captcha.opacity) {
			for (let n = 0; n < coordinates.length; n++) {
				const char = this.captcha.text ? this.captcha.text[n] : '';
				let charOptions = { ...this.captcha }; // Default to global captcha options

				// Find specific options for this character
				for (const segmentOpt of this.captchaSegments) {
					const start = segmentOpt.start !== undefined ? segmentOpt.start : 0;
					const end = segmentOpt.end !== undefined ? segmentOpt.end : this.captcha.characters;

					if (n >= start && n < end) {
						charOptions = merge(charOptions, segmentOpt) as SetCaptchaOptions;
					}
				}

				ctx.font = `${charOptions.size}px ${charOptions.font}`;
				ctx.globalAlpha = charOptions.opacity || 1;
				ctx.fillStyle = charOptions.color || '#000000';

				ctx.save();
				ctx.translate(coordinates[n][0], coordinates[n][1]);
				if (charOptions.skew) {
					ctx.transform(1, Math.random(), getRandom(0, 20) / 100, 1, 0, 0);
				}
				if (charOptions.rotate && charOptions.rotate > 0) {
					ctx.rotate(
						(getRandom(-charOptions.rotate, charOptions.rotate) * Math.PI) / 180
					);
				}
				if (charOptions.colors && charOptions.colors.length >= 2) {
					ctx.fillStyle = charOptions.colors[
						getRandom(0, charOptions.colors.length - 1)
					];
				}
				ctx.fillText(char, 0, 0);
				ctx.restore();
			}
		}

		return canvas.toBuffer();
	}

	generateSync(options: { background?: Image } = {}): Buffer {
		const canvas = createCanvas(this.width, this.height);
		const ctx = canvas.getContext('2d');
		ctx.lineJoin = 'miter';
		ctx.textBaseline = 'middle';

		let coordinates: number[][] = [];
		if (!this.captcha.characters) this.captcha.characters = 0;
		for (let i = 0; i < this.captcha.characters; i++) {
			const widthGap = Math.floor(this.width / (this.captcha.characters || 1));
			const coordinate: number[] = [];
			const randomWidth = widthGap * (i + 0.2);
			coordinate.push(randomWidth);
			const randomHeight = getRandom(PD, this.height - PD);
			coordinate.push(randomHeight);
			coordinates.push(coordinate);
		}
		coordinates = coordinates.sort((a, b) => a[0] - b[0]);

		if (options.background) {
			ctx.drawImage(options.background, 0, 0, this.width, this.height);
		}

		if (this.decoy.opacity) {
			const decoyTextCount = Math.floor((this.height * this.width) / 10000);
			const decoyText = randomBytes(decoyTextCount).toString('hex').split('');
			ctx.font = `${this.decoy.size}px ${this.decoy.font}`;
			ctx.globalAlpha = this.decoy.opacity;
			ctx.fillStyle = this.decoy.color || '#000000';
			for (let i = 0; i < decoyText.length; i++) {
				ctx.fillText(
					decoyText[i],
					getRandom(PD, this.width - PD),
					getRandom(PD, this.height - PD)
				);
			}
		}

		if (this.trace.opacity) {
			ctx.strokeStyle = this.trace.color || '#000000';
			ctx.globalAlpha = this.trace.opacity;
			ctx.beginPath();
			ctx.moveTo(coordinates[0][0], coordinates[0][1]);
			ctx.lineWidth = this.trace.size || 1;
			for (let i = 1; i < coordinates.length; i++) {
				ctx.lineTo(coordinates[i][0], coordinates[i][1]);
			}
			ctx.stroke();
		}

		if (this.captcha.opacity) {
			for (let n = 0; n < coordinates.length; n++) {
				const char = this.captcha.text ? this.captcha.text[n] : '';
				let charOptions = { ...this.captcha }; // Default to global captcha options

				// Find specific options for this character
				for (const segmentOpt of this.captchaSegments) {
					const start = segmentOpt.start !== undefined ? segmentOpt.start : 0;
					const end = segmentOpt.end !== undefined ? segmentOpt.end : this.captcha.characters;

					if (n >= start && n < end) {
						charOptions = merge(charOptions, segmentOpt) as SetCaptchaOptions;
					}
				}

				ctx.font = `${charOptions.size}px ${charOptions.font}`;
				ctx.globalAlpha = charOptions.opacity || 1;
				ctx.fillStyle = charOptions.color || '#000000';

				ctx.save();
				ctx.translate(coordinates[n][0], coordinates[n][1]);
				if (charOptions.skew) {
					ctx.transform(1, Math.random(), getRandom(0, 20) / 100, 1, 0, 0);
				}
				if (charOptions.rotate && charOptions.rotate > 0) {
					ctx.rotate(
						(getRandom(-charOptions.rotate, charOptions.rotate) * Math.PI) / 180
					);
				}
				if (charOptions.colors && charOptions.colors.length >= 2) {
					ctx.fillStyle = charOptions.colors[
						getRandom(0, charOptions.colors.length - 1)
					];
				}
				ctx.fillText(char, 0, 0);
				ctx.restore();
			}
		}

		return canvas.toBuffer();
	}
}

export default CaptchaGenerator;
