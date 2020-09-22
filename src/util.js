module.exports = {
    coordinates: function(value, getRandom){
        let coordinates = [];
        /*get coordinates for captcha characters and trace line*/
        for (let i = 0; i < value.captcha.characters; i++) {
            const widthGap = Math.floor(value.width/(value.captcha.characters));
            let coordinate = [];
            let randomWidth = widthGap*(i + 0.2);
            coordinate.push(randomWidth);
            let randomHeight = getRandom(value.height);
            coordinate.push(randomHeight);
            coordinates.push(coordinate);
        }
        coordinates = coordinates.sort((a, b) => a[0] - b[0]);
        return coordinates;
    },
    background: async function(ctx, value) {
        
    }
}