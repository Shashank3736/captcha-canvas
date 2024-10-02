const fs = require('fs');
const { Captcha, createCaptcha } = require('../js-script');
const { createCanvas } = require('canvas');

function test1() {
	const canvas = createCanvas(300, 100);
	const ctx = canvas.getContext('2d');

	const { text } = createCaptcha({
		ctx,
	});

	console.log(text);
	fs.writeFileSync('./examples/example.png', canvas.toBuffer('image/png'));
}

async function test2() {
	const canvas = createCanvas(600, 400);
	const ctx = canvas.getContext('2d');

	const captcha = new Captcha({ ctx, characters: 8 });

	captcha.drawCaptcha({
		color: 'deeppink',
		size: 60,
	});
	captcha.drawTrace({
		size: 5,
		color: 'deeppink',
	});
	captcha.addDecoy({
		total: 100,
	});

	const text = captcha.text;
	fs.writeFileSync(`./examples/tmp/${new Date().getTime()}-${text}.png`, canvas.toBuffer('image/png'));
}

test1();
test2();