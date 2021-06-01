const { loadImage } = require('canvas');

module.exports = {
	CaptchaGenerator: require('./src/main'),
	version: require('./package.json').version,
	resolveImage: loadImage,
};