const { writeFileSync } = require('fs');
const { createCaptchaSync } = require('./js-script/extra');

const captcha = createCaptchaSync(900, 300, {
	captcha: {
		size: 80,
	},
});

writeFileSync('assets/captcha/default.png', captcha.image);