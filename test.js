// const { CaptchaGenerator, resolveImage } = require("./");
// const fs = require('fs');
// (async() => {
//     const captcha = new CaptchaGenerator()
//     .generateSync()
    
//     fs.writeFileSync("assets/captcha/default.png", captcha)
// })();

const { merge } = require("./src/util");

const object = merge({a: "first", b: "second"}, {b: "third", c: "fourth"});

console.log(object)