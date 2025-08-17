import { Image } from "skia-canvas";

/**
 * Configuration interface for CAPTCHA canvas dimensions.
 */
export interface SetDimensionOption {
    /** Height of the CAPTCHA image in pixels */
    height: number;
    /** Width of the CAPTCHA image in pixels */
    width: number;
}

/**
 * Configuration interface for CAPTCHA text appearance and generation in CaptchaGenerator.
 * 
 * @example Basic text configuration
 * ```typescript
 * const config: SetCaptchaOption = {
 *   text: 'HELLO',
 *   size: 50,
 *   color: '#2c3e50'
 * };
 * ```
 * 
 * @example Random text generation
 * ```typescript
 * const config: SetCaptchaOption = {
 *   characters: 8,
 *   size: 45,
 *   colors: ['#e74c3c', '#3498db', '#27ae60']
 * };
 * ```
 */
export interface SetCaptchaOption {
    /** Number of random characters to generate (ignored if text is provided) */
    characters?: number;
    /** Specific text to display (overrides random generation) */
    text?: string;
    /** Text color as hex code, RGB, or color name (overridden by colors array) */
    color?: string;
    /** Font family name (e.g., 'Arial', 'Times', 'Sans') */
    font?: string;
    /** Whether to apply random skewing transformation to characters */
    skew?: boolean;
    /** Array of colors for multi-color text (overrides color property) */
    colors?: string[];
    /** Maximum rotation angle in degrees (±rotate range) */
    rotate?: number;
    /** Font size in pixels */
    size?: number;
    /** Text opacity (0.0 to 1.0) */
    opacity?: number;
}

/**
 * Configuration interface for CAPTCHA text drawing in the Captcha class.
 * Similar to SetCaptchaOption but without the characters property for random generation.
 * 
 * @example
 * ```typescript
 * const config: DrawCaptchaOption = {
 *   text: 'SECURE',
 *   size: 60,
 *   rotate: 15,
 *   skew: true,
 *   colors: ['#e74c3c', '#f39c12']
 * };
 * ```
 */
export interface DrawCaptchaOption {
    /** Specific text to display */
    text?: string;
    /** Text color as hex code, RGB, or color name */
    color?: string;
    /** Font family name */
    font?: string;
    /** Whether to apply random skewing transformation */
    skew?: boolean;
    /** Array of colors for multi-color text */
    colors?: string[];
    /** Maximum rotation angle in degrees */
    rotate?: number;
    /** Font size in pixels */
    size?: number;
    /** Text opacity (0.0 to 1.0) */
    opacity?: number;
}

/**
 * Configuration interface for decoy characters that add security noise.
 * 
 * @example Basic decoy setup
 * ```typescript
 * const config: SetDecoyOption = {
 *   total: 30,
 *   opacity: 0.3,
 *   color: '#95a5a6'
 * };
 * ```
 */
export interface SetDecoyOption {
    /** Color of decoy characters */
    color?: string;
    /** Font family for decoy characters */
    font?: string;
    /** Font size of decoy characters in pixels */
    size?: number;
    /** Opacity of decoy characters (0.0 to 1.0) */
    opacity?: number;
    /** Total number of decoy characters to generate */
    total?: number;
}

/**
 * Configuration interface for trace lines connecting CAPTCHA characters.
 * 
 * @example
 * ```typescript
 * const config: SetTraceOption = {
 *   color: '#95a5a6',
 *   size: 3,
 *   opacity: 0.8
 * };
 * ```
 */
export interface SetTraceOption {
    /** Color of the trace line */
    color?: string;
    /** Width of the trace line in pixels */
    size?: number;
    /** Opacity of the trace line (0.0 to 1.0) */
    opacity?: number;
}

/**
 * Configuration interface for the simple createCaptcha functions.
 * 
 * @example Complete configuration
 * ```typescript
 * const options: CreateCaptchaOptions = {
 *   captcha: { text: 'HELLO', size: 50 },
 *   trace: { color: '#95a5a6', size: 3 },
 *   decoy: { total: 25, opacity: 0.3 },
 *   background: backgroundImage
 * };
 * ```
 */
export interface CreateCaptchaOptions {
    /** CAPTCHA text configuration (single or array for multi-styled text) */
    captcha?: SetCaptchaOption | SetCaptchaOption[];
    /** Trace line configuration */
    trace?: SetTraceOption;
    /** Decoy characters configuration */
    decoy?: SetDecoyOption;
    /** Pre-loaded background image */
    background?: Image;
}

/**
 * Default configuration for CAPTCHA text drawing operations.
 * 
 * These defaults provide a good balance between security and readability,
 * with moderate styling that makes the text challenging for OCR while
 * remaining accessible to humans.
 * 
 * @example Using defaults
 * ```typescript
 * const captcha = new Captcha(300, 100);
 * captcha.drawCaptcha(); // Uses all default values
 * ```
 * 
 * @example Overriding specific defaults
 * ```typescript
 * const captcha = new Captcha(300, 100);
 * captcha.drawCaptcha({
 *   ...defaultDrawCaptchaOption,
 *   text: 'CUSTOM',
 *   size: 60
 * });
 * ```
 */
 export const defaultDrawCaptchaOption: DrawCaptchaOption = {
	/** Default font size in pixels */
	size: 40,
	/** Default font family */
	font: 'Sans',
	/** Enable skewing by default for security */
	skew: true,
	/** Empty colors array - uses color property instead */
	colors: [],
	/** Default rotation range (±5 degrees) */
	rotate: 5,
	/** Default text color (green) */
	color: '#32cf7e',
	/** Default text opacity */
	opacity: 0.8,
};
/**
 * Default configuration for CAPTCHA text generation and appearance.
 * 
 * These settings provide secure defaults suitable for most use cases,
 * generating 6-character random text with moderate visual distortions
 * that balance security against readability.
 * 
 * @example Using defaults with CaptchaGenerator
 * ```typescript
 * const captcha = new CaptchaGenerator();
 * // Uses defaultCaptchaOption settings automatically
 * ```
 * 
 * @example Customizing specific properties
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setCaptcha({
 *     ...defaultCaptchaOption,
 *     characters: 8,  // Override just the length
 *     size: 50        // Override just the size
 *   });
 * ```
 */
export const defaultCaptchaOption: SetCaptchaOption = {
    /** Default number of random characters to generate */
    characters: 6,
	/** Default font size in pixels */
	size: 40,
	/** Default font family */
	font: 'Sans',
	/** Enable skewing by default for security */
	skew: true,
	/** Empty colors array - uses color property instead */
	colors: [],
	/** Default rotation range (±5 degrees) */
	rotate: 5,
	/** Default text color (green) */
	color: '#32cf7e',
	/** Default text opacity */
	opacity: 0.8,
};
/**
 * Default configuration for trace lines connecting CAPTCHA characters.
 * 
 * Trace lines provide additional security by making character segmentation
 * more difficult for automated systems. These defaults create visible but
 * not overwhelming connecting lines.
 * 
 * @example Using default trace
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setCaptcha({ text: 'HELLO' })
 *   .setTrace({}); // Uses all defaults
 * ```
 * 
 * @example Customizing trace appearance
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setTrace({
 *     ...defaultTraceOptions,
 *     color: '#95a5a6',  // Different color
 *     opacity: 0.7       // More subtle
 *   });
 * ```
 */
export const defaultTraceOptions: SetTraceOption = {
	/** Default trace line width in pixels */
	size: 3,
	/** Default trace line color (matches text color) */
	color: '#32cf7e',
	/** Default trace line opacity (fully opaque) */
	opacity: 1,
};
/**
 * Default configuration for decoy characters that add security noise.
 * 
 * Decoy characters are fake letters scattered around the CAPTCHA to confuse
 * OCR systems. These defaults create subtle noise that doesn't interfere
 * with human readability while significantly increasing security.
 * 
 * @example Using default decoys
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setCaptcha({ text: 'HELLO' })
 *   .setDecoy({}); // Uses all defaults, total calculated automatically
 * ```
 * 
 * @example Customizing decoy appearance
 * ```typescript
 * const captcha = new CaptchaGenerator()
 *   .setDecoy({
 *     ...defaultDecoyOptions,
 *     total: 50,      // More decoys for higher security
 *     opacity: 0.3    // More subtle appearance
 *   });
 * ```
 */
export const defaultDecoyOptions: SetDecoyOption = {
	/** Default decoy character color (gray) */
	color: '#646566',
	/** Default font family for decoys */
	font: 'Sans',
	/** Default decoy character size (smaller than main text) */
	size: 20,
	/** Default decoy opacity (semi-transparent) */
	opacity: 0.8,
};
/**
 * Default dimensions for CAPTCHA images.
 * 
 * These dimensions provide a good balance between readability and file size,
 * suitable for most web applications and forms. The 3:1 aspect ratio allows
 * for comfortable text spacing.
 * 
 * @example Using default dimensions
 * ```typescript
 * const captcha = new Captcha(); // Uses 300x100 by default
 * ```
 * 
 * @example Scaling from defaults
 * ```typescript
 * const largeCaptcha = new Captcha(
 *   defaultDimension.width * 1.5,  // 450px wide
 *   defaultDimension.height * 1.5  // 150px tall
 * );
 * ```
 */
export const defaultDimension: SetDimensionOption = {
    /** Default CAPTCHA height in pixels */
    height: 100,
    /** Default CAPTCHA width in pixels */
    width: 300
};
/**
 * Empty object for JSDoc compatibility.
 * The actual CreateCaptchaOptions interface is defined above.
 * 
 * @deprecated Use the CreateCaptchaOptions interface instead
 */
export const CreateCaptchaOptions = {};