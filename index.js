const { Canvas } = require("canvas-constructor");
const crypto = require('crypto');
const GIF = require('gifencoder');
class CaptchaGenerator {
    constructor(options = {}) {
        this.height = options.height || 200;
        this.width = options.width || 600;
        this.mainColor = options.color || "#32cf7e";
        this.font = options.font || "Comic Sans MS";
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
    create(options = {}) {
        const canvas = new Canvas(this.width, this.height);
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
        if(!this.noDecoy) {
            const decoyTextCount = Math.floor(this.height*this.width/10000)
            let decoyText = crypto.randomBytes(decoyTextCount).toString('hex').split('');
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
        canvas.setTextFont(`${this.fontSize} "${this.font}"`).setColor(this.mainColor)
        for(let n = 0; n < coordinates.length; n++) {
            canvas.printText(this.captchaText[n], coordinates[n][0], coordinates[n][1])
        }
        if(options.noBuffer) return canvas
        return canvas.toBuffer()
    }
    createGif(options = {}) {
        let frames = options.frames || 2
        let repeat = options.repeat || 0
        let delay = options.delay || 1000
        const gif = new GIF(this.width, this.height);
        gif.start();
        gif.setRepeat(repeat);
        gif.setDelay(delay);
        for(let i = 0; i < frames; i++) {
            gif.addFrame(this.create({noBuffer: true}))
        }
        gif.finish();
        return gif.out.getData()
    }
}

module.exports = CaptchaGenerator;