/**
 * Configuration options for setting canvas dimensions.
 * 
 * @example
 * ```typescript
 * const options: SetDimensionOption = {
 *   height: 200,  // Canvas height in pixels
 *   width: 500    // Canvas width in pixels
 * };
 * 
 * const captcha = new CaptchaGenerator(options);
 * ```
 */
export interface SetDimensionOption {
	/** Canvas height in pixels (default: 100) */
	height?: number;
	/** Canvas width in pixels (default: 300) */
	width?: number;
}
/**
 * Configuration options for captcha text appearance and behavior.
 * 
 * This interface defines all the customization options available for the captcha text,
 * including styling, positioning, and visual effects. It supports both single-style
 * captchas and segmented captchas where different parts can have different styles.
 * 
 * @example Basic Text Configuration
 * ```typescript
 * const options: SetCaptchaOptions = {
 *   text: 'HELLO',
 *   color: 'blue',
 *   size: 60,
 *   font: 'Arial'
 * };
 * ```
 * 
 * @example Auto-generated Text
 * ```typescript
 * const options: SetCaptchaOptions = {
 *   characters: 6,        // Generate 6 random characters
 *   colors: ['red', 'blue', 'green'],
 *   size: 50,
 *   rotate: 15
 * };
 * ```
 * 
 * @example Segmented Styling
 * ```typescript
 * const segments: SetCaptchaOptions[] = [
 *   { text: 'SEC', color: 'red', size: 60, start: 0, end: 3 },
 *   { text: 'URE', color: 'blue', size: 50, start: 3, end: 6 }
 * ];
 * ```
 */
export interface SetCaptchaOptions {
	/** Number of characters to generate (ignored if text is provided) */
	characters?: number;
	/** Custom captcha text (auto-generated if not provided) */
	text?: string;
	/** Text color (CSS color string, default: '#32cf7e') */
	color?: string;
	/** Font family name (default: 'Sans') */
	font?: string;
	/** Whether to apply skewing transformation (default: true) */
	skew?: boolean;
	/** Array of colors for random selection per character */
	colors?: string[];
	/** Maximum rotation angle in degrees (default: 5) */
	rotate?: number;
	/** Font size in pixels (default: 40) */
	size?: number;
	/** Text opacity from 0 to 1 (default: 0.8) */
	opacity?: number;
	/** Start index for segmented text styling */
	start?: number;
	/** End index for segmented text styling */
	end?: number;
}
/**
 * Configuration options for trace lines that connect captcha characters.
 * 
 * Trace lines are drawn between character positions to add visual complexity
 * and improve security by making it harder for OCR systems to isolate individual
 * characters. These lines create visual noise while maintaining human readability.
 * 
 * @example Basic Trace Configuration
 * ```typescript
 * const traceOptions: SetTraceOptions = {
 *   color: 'red',
 *   size: 3,
 *   opacity: 0.8
 * };
 * 
 * captcha.setTrace(traceOptions);
 * ```
 * 
 * @example Subtle Trace Lines
 * ```typescript
 * const subtleTrace: SetTraceOptions = {
 *   color: 'lightgray',
 *   size: 2,
 *   opacity: 0.4  // Very subtle
 * };
 * ```
 */
export interface SetTraceOptions {
	/** Line color (CSS color string, default: '#32cf7e') */
	color?: string;
	/** Line width in pixels (default: 3) */
	size?: number;
	/** Line opacity from 0 to 1 (default: 1) */
	opacity?: number;
}
/**
 * Configuration options for decoy characters scattered across the captcha background.
 * 
 * Decoy characters are random characters placed throughout the captcha image to
 * confuse OCR systems and automated solvers. They appear as background noise and
 * significantly improve security by making it harder to identify the actual text.
 * The number of decoy characters is automatically calculated based on canvas size.
 * 
 * @example Basic Decoy Configuration
 * ```typescript
 * const decoyOptions: SetDecoyOptions = {
 *   color: 'gray',
 *   font: 'Arial',
 *   size: 20,
 *   opacity: 0.5
 * };
 * 
 * captcha.setDecoy(decoyOptions);
 * ```
 * 
 * @example High Security Decoys
 * ```typescript
 * const secureDecoys: SetDecoyOptions = {
 *   color: 'darkgray',
 *   size: 25,
 *   opacity: 0.7  // More visible for higher security
 * };
 * ```
 */
export interface SetDecoyOptions {
	/** Decoy text color (CSS color string, default: '#646566') */
	color?: string;
	/** Font family for decoy characters (default: 'Sans') */
	font?: string;
	/** Font size for decoy characters in pixels (default: 20) */
	size?: number;
	/** Decoy text opacity from 0 to 1 (default: 0.8) */
	opacity?: number;
}
/**
 * Default configuration options for captcha text.
 * 
 * These values are used when no custom options are provided. They represent
 * a balanced configuration that provides good security while maintaining readability.
 * 
 * @example
 * ```typescript
 * // These are the default values used internally
 * const defaults = {
 *   characters: 6,        // 6 random characters
 *   size: 40,            // 40px font size
 *   font: 'Sans',        // Sans-serif font
 *   skew: true,          // Enable skewing
 *   colors: [],          // No color array (uses single color)
 *   rotate: 5,           // Max 5 degrees rotation
 *   color: '#32cf7e',    // Green color
 *   opacity: 0.8         // 80% opacity
 * };
 * ```
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
 * Default configuration options for trace lines.
 * 
 * These values provide a good balance between security enhancement and visual appeal.
 * The trace lines are fully opaque and use the same color as the default text.
 * 
 * @example
 * ```typescript
 * // Default trace line configuration
 * const defaults = {
 *   size: 3,             // 3px line width
 *   color: '#32cf7e',    // Same green as default text
 *   opacity: 1           // Fully opaque
 * };
 * ```
 */
export const defaultTraceOptions: SetTraceOptions = {
	size: 3,
	color: '#32cf7e',
	opacity: 1,
};
/**
 * Default configuration options for decoy characters.
 * 
 * These values create subtle background noise that confuses OCR systems without
 * significantly impacting human readability. The decoy characters are smaller
 * and use a neutral gray color.
 * 
 * @example
 * ```typescript
 * // Default decoy character configuration
 * const defaults = {
 *   color: '#646566',    // Neutral gray color
 *   font: 'Sans',        // Same font as main text
 *   size: 20,            // Smaller than default text (40px)
 *   opacity: 0.8         // 80% opacity
 * };
 * ```
 */
export const defaultDecoyOptions: SetDecoyOptions = {
	color: '#646566',
	font: 'Sans',
	size: 20,
	opacity: 0.8,
};