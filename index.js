var stylecow = require('./stylecow/Parser.js');
var nestedRules = require('./stylecow/plugins/NestedRules.js');

var css = stylecow.parseFile('./test.css');

nestedRules.apply(css);

//css.toString();

console.log(css.toString());

