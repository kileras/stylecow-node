var Stylecow = require('./stylecow/Parser.js');

var NestedRules = require('./stylecow/plugins/NestedRules.js'),
	Rem = require('./stylecow/plugins/Rem.js'),
	Matches = require('./stylecow/plugins/Matches.js'),
	Initial = require('./stylecow/plugins/Initial.js'),
	IeFloat = require('./stylecow/plugins/IeFloat.js'),
	IeInlineBlock = require('./stylecow/plugins/IeInlineBlock.js'),
	IeMinHeight = require('./stylecow/plugins/IeMinHeight.js'),
	IeClip = require('./stylecow/plugins/IeClip.js');

var css = Stylecow.parseFile('./test2.css');

NestedRules.apply(css);
Rem.apply(css);
IeClip.apply(css);
IeFloat.apply(css);
IeInlineBlock.apply(css);
IeMinHeight.apply(css);
Initial.apply(css);
Matches.apply(css);

//css.toString();

console.log(css.toString());

