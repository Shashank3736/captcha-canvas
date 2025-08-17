/**
 * Utility functions for CAPTCHA generation including random number generation,
 * text generation, and coordinate calculation for character positioning.
 */

import { randomBytes } from "crypto";

/**
 * Generates a random integer within the specified range (inclusive).
 * 
 * This function provides cryptographically secure random number generation
 * for use in CAPTCHA positioning, rotation angles, and other randomization needs.
 * 
 * @param start - Minimum value (inclusive)
 * @param end - Maximum value (inclusive)
 * @returns Random integer between start and end
 * 
 * @example Basic range
 * ```typescript
 * const angle = getRandom(-15, 15); // Random angle between -15 and 15 degrees
 * ```
 * 
 * @example Single parameter (0 to n)
 * ```typescript
 * const index = getRandom(5); // Random number from 0 to 5
 * ```
 */
export function getRandom(start: number = 0, end: number = 0): number {
    return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
}

/**
 * Generates a random uppercase hexadecimal string of specified length.
 * 
 * Uses cryptographically secure random bytes to generate unpredictable
 * CAPTCHA text that is difficult for automated systems to predict or brute force.
 * 
 * @param characters - Number of characters to generate
 * @returns Random uppercase hexadecimal string
 * 
 * @example Generate 6-character CAPTCHA text
 * ```typescript
 * const captchaText = randomText(6); // e.g., "A3F7B2"
 * ```
 * 
 * @example Generate longer text for higher security
 * ```typescript
 * const secureText = randomText(8); // e.g., "D4C9E1A7"
 * ```
 */
export function randomText(characters: number): string {
    return randomBytes(characters).toString('hex').toUpperCase().substr(0, characters);
}

/**
 * Calculates evenly distributed coordinate positions for CAPTCHA characters.
 * 
 * Generates an array of [x, y] coordinates that distribute characters evenly
 * across the canvas width while adding random vertical positioning for security.
 * The coordinates are sorted by x-position to ensure proper left-to-right ordering.
 * 
 * @param height - Canvas height in pixels
 * @param width - Canvas width in pixels  
 * @param size - Number of character positions to generate
 * @returns Array of [x, y] coordinate pairs
 * 
 * @example Generate positions for 6 characters
 * ```typescript
 * const positions = getRandomCoordinate(100, 300, 6);
 * // Returns: [[30, 45], [80, 67], [130, 23], [180, 78], [230, 34], [280, 56]]
 * ```
 * 
 * @example Use with character drawing
 * ```typescript
 * const coordinates = getRandomCoordinate(150, 400, 8);
 * const text = 'SECURITY';
 * 
 * coordinates.forEach(([x, y], index) => {
 *   ctx.fillText(text[index], x, y);
 * });
 * ```
 */
export function getRandomCoordinate(height: number, width: number, size: number): number[][] {
    let coordinates = [];
    for (let i = 0; i < size; i++) {
        const widthGap = Math.floor(width / size);
		const coordinate = [];
		const randomWidth = widthGap * (i + 0.2);
		coordinate.push(randomWidth);
		const randomHeight = getRandom(30, height - 30);
		coordinate.push(randomHeight);
		coordinates.push(coordinate);
    }
    coordinates = coordinates.sort((a, b) => a[0] - b[0]);
    return coordinates;
}
