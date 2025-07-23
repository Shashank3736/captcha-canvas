/**
 * @interface SetDimensionOption
 * @description Options for setting canvas dimensions
 * @property {number} height Height of the canvas
 * @property {number} width Width of the canvas
 */
export interface SetDimensionOption {
	height?: number;
	width?: number;
}
/**
 * @interface SetCaptchaOptions
 * @description Options for setting captcha text
 * @property {number} characters Number of characters in captcha
 * @property {string} text Captcha text
 * @property {string} color Color of the captcha text
 * @property {string} font Font of the captcha text
 * @property {boolean} skew Whether to skew the captcha text
 * @property {string[]} colors Array of colors for captcha text
 * @property {number} rotate Rotation angle of captcha text
 * @property {number} size Size of the captcha text
 * @property {number} opacity Opacity of the captcha text
 * @property {number} start Start index of the segment
 * @property {number} end End index of the segment
 */
export interface SetCaptchaOptions {
	characters?: number;
	text?: string;
	color?: string;
	font?: string;
	skew?: boolean;
	colors?: string[];
	rotate?: number;
	size?: number;
	opacity?: number;
	start?: number;
	end?: number;
}
/**
 * @interface SetTraceOptions
 * @description Options for setting trace lines
 * @property {string} color Color of the trace line
 * @property {number} size Width of the trace line
 * @property {number} opacity Opacity of the trace line
 */
export interface SetTraceOptions {
	color?: string;
	size?: number;
	opacity?: number;
}
/**
 * @interface SetDecoyOptions
 * @description Options for setting decoy characters
 * @property {string} color Color of the decoy characters
 * @property {string} font Font of the decoy characters
 * @property {number} size Size of the decoy characters
 * @property {number} opacity Opacity of the decoy characters
 */
export interface SetDecoyOptions {
	color?: string;
	font?: string;
	size?: number;
	opacity?: number;
}
/**
 * @name defaultCaptchaOptions
 * @description Default options for captcha
 */
export const defaultCaptchaOptions: SetCaptchaOptions = {
	characters: 6,
	size: 40,
	font: 'Sans',
	skew: true,
	colors: [],
	rotate: 5,
	color: '#32cf7e',
	opacity: 0.8,
};
/**
 * @name defaultTraceOptions
 * @description Default options for trace
 */
export const defaultTraceOptions: SetTraceOptions = {
	size: 3,
	color: '#32cf7e',
	opacity: 1,
};
/**
 * @name defaultDecoyOptions
 * @description Default options for decoy
 */
export const defaultDecoyOptions: SetDecoyOptions = {
	color: '#646566',
	font: 'Sans',
	size: 20,
	opacity: 0.8,
};