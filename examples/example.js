const { CaptchaGenerator } = require('../dist/index');
const fs = require('fs');

(async () => {
	const captcha = new CaptchaGenerator();
	fs.writeFileSync('./examples/default.png', captcha.generateSync());
	/* Set dimension method example*/
	captcha.setDimension(200, 400);
	fs.writeFileSync('./examples/dimension.png', captcha.generateSync());
	/* Set Captcha Method example*/
	captcha.setCaptcha({
		color: 'deeppink',
		font: 'Candara',
		size: '60',
		characters: 8,
	})
		.setDimension(150, 450);
	fs.writeFileSync('./examples/captcha.png', captcha.generateSync());
	console.log(captcha.text);
	/* All methods at once*/
	captcha
		.setCaptcha({ color: 'deeppink', size: 60, text: 'CUSTOM05' })
		.setDecoy({ opacity: 0.5 })
		.setTrace({ color: 'deeppink', size: 5 });
	fs.writeFileSync('./examples/all.png', captcha.generateSync());
	// console text of captcha
	console.log(captcha.text);
	/* Set Captcha with segments example*/
	captcha.setCaptcha([
		{ text: 'AB', color: 'red', size: 60, start: 0, end: 2 },
		{ text: 'CD', color: 'green', size: 40, start: 2, end: 4 },
		{ text: 'EF', color: 'blue', size: 50, start: 4, end: 6 },
	]);
	captcha.setDimension(150, 450);
	fs.writeFileSync('./examples/segmented_captcha.png', captcha.generateSync());
	console.log('Segmented Captcha Text:', captcha.text);
})();