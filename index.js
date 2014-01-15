var styleCow = require('./stylecow/index.js');

var css = styleCow.loadFile('./test2.css');

styleCow.transform(css);

console.log(css.toString());


/*
BaseUrl
Grid
Math
MediaQuery
*/
