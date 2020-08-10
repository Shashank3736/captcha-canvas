const { Canvas } = require("canvas-constructor");
const crypto = require('crypto');

class CaptchaGenerator {
    constructor(options = {}) {
        this.height = options.height || 200;
        this.width = options.width || 600;
        this.mainColor = options.color || "#32cf7e";
        this.font = options.font || "Sans";
        this.characters = options.text? options.text.length : options.characters || 6;
        this.captchaText = options.text? options.text : crypto.randomBytes(32).toString('hex').toUpperCase().replace(/[^a-z]/gi, '').substr(0, this.characters);
        this.noDecoy = options.noDecoy || false;
        this.decoyColor = options.decoyColor || "#646566";
        this.noTrace = options.noTrace || false;
        this.traceSize = options.traceSize || 3;
        this.fontSize = options.fontSize || '40px';
    }
    getRandom(n) {
        return Math.floor(Math.random()*(n - 30)) + 30
    }
    create() {
        let coordinates = []
        for (let i = 0; i < this.characters; i++) {
            const widhtGap = Math.floor(this.width/(this.characters));
            let coordinate = [];
            let randomWidth = widhtGap*(i + 0.5);
            coordinate.push(randomWidth);
            let randomHeight = this.getRandom(this.height);
            coordinate.push(randomHeight);
            coordinates.push(coordinate)
        }
        coordinates = coordinates.sort((a, b) => a[0] - b[0]);
        const canvas = new Canvas(this.width, this.height);
        if(!this.noDecoy) {
            let decoyText = crypto.randomBytes(5).toString('hex').split('');
            canvas.setTextFont('20px Sans')
            .setColor(this.decoyColor)
            for(let i = 0; i < decoyText.length; i++) {
                canvas.printText(decoyText[i], this.getRandom(this.width), this.getRandom(this.height))
            }
        }
        if(!this.noTrace) {
            canvas.setStroke(this.mainColor)
            for(let i = 0; i + 1 < coordinates.length; i++) {
                canvas.setStrokeWidth(this.traceSize).beginPath()
                .moveTo(coordinates[i][0], coordinates[i][1])
                .lineTo(coordinates[i+1][0], coordinates[i+1][1])
                .stroke()
            }
        }
        canvas.setTextFont(`${this.fontSize} ${this.font}`).setColor(this.mainColor)
        for(let n = 0; n < coordinates.length; n++) {
            canvas.printText(this.captchaText[n], coordinates[n][0], coordinates[n][1])
        }
        return canvas.toBuffer()
    }
}

module.exports = CaptchaGenerator;