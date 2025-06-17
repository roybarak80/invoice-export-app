const fs = require('fs');
const font = fs.readFileSync('./src/assets/fonts/MiriamLibre-Regular.ttf');
const base64 = font.toString('base64');
fs.writeFileSync('miriam-libre-base64.txt', base64);