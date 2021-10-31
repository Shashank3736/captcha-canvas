const fs = require('fs');
const { CaptchaGenerator } = require('../js-script/index');

(async () => {
	const captcha = new CaptchaGenerator('canvas');
	fs.writeFileSync('./examples/default.png', await captcha.toBuffer());
	/* Set dimension method example*/
	captcha.setDimension(200, 400);
	fs.writeFileSync('./examples/dimension.png', await captcha.toBuffer());
	/* Set Captcha Method example*/
	captcha.setCaptcha({
		color: 'deeppink',
		font: 'Candara',
		size: '60',
		characters: 8,
	})
		.setDimension(150, 450);
	fs.writeFileSync('./examples/captcha.png', await captcha.toBuffer());
	console.log(captcha.text);
	/* All methods at once*/
	captcha
		.setCaptcha({ color: 'deeppink', size: 60, text: 'CUSTOM05' })
		.setDecoy({ opacity: 0.5 })
		.setTrace({ color: 'deeppink', size: 5 });
	fs.writeFileSync('./examples/all.png', await captcha.toBuffer());
	// console text of captcha
	console.log(captcha.text);
})();

