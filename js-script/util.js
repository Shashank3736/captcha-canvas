"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomCoordinate = exports.randomText = exports.getRandom = void 0;
var crypto_1 = require("crypto");
function getRandom(start, end) {
    if (start === void 0) { start = 0; }
    if (end === void 0) { end = 0; }
    return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
}
exports.getRandom = getRandom;
;
function randomText(characters) {
    return (0, crypto_1.randomBytes)(characters).toString('hex').toUpperCase().substr(0, characters);
}
exports.randomText = randomText;
;
function getRandomCoordinate(height, width, size) {
    var coordinates = [];
    for (var i = 0; i < size; i++) {
        var widthGap = Math.floor(width / size);
        var coordinate = [];
        var randomWidth = widthGap * (i + 0.2);
        coordinate.push(randomWidth);
        var randomHeight = getRandom(30, height - 30);
        coordinate.push(randomHeight);
        coordinates.push(coordinate);
    }
    ;
    coordinates = coordinates.sort(function (a, b) { return a[0] - b[0]; });
    return coordinates;
}
exports.getRandomCoordinate = getRandomCoordinate;
;
