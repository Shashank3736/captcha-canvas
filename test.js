const { CaptchaGenerator, resolveImage } = require("./");
const fs = require('fs');
(async() => {
    const captcha = new CaptchaGenerator()
    .generateSync()
    
    fs.writeFileSync("assets/captcha/default.png", captcha)
})();