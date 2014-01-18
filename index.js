var styleCow = require('stylecow');

var css = styleCow.loadFile('./test.css').transform().toString();

console.log(css);