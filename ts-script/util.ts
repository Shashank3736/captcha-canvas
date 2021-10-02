import { randomBytes } from "crypto";

export function getRandom(start: number = 0, end: number = 0): number {
    return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
};

export function randomText(characters: number): string {
    return randomBytes(characters).toString('hex').toUpperCase().substr(0, characters);
};

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
    };
    coordinates = coordinates.sort((a, b) => a[0] - b[0]);
    return coordinates;
};
