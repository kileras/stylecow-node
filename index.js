var styleCow = require('./stylecow/index.js');

var css = styleCow.loadFile('./test2.css');

styleCow.transform(css);

console.log(css.toString());

/*
var NestedRules = require('./stylecow/plugins/NestedRules.js'),
	Rem = require('./stylecow/plugins/Rem.js'),
	Matches = require('./stylecow/plugins/Matches.js'),
	Initial = require('./stylecow/plugins/Initial.js'),
	IeFloat = require('./stylecow/plugins/IeFloat.js'),
	IeInlineBlock = require('./stylecow/plugins/IeInlineBlock.js'),
	IeMinHeight = require('./stylecow/plugins/IeMinHeight.js'),
	IeOpacity = require('./stylecow/plugins/IeOpacity.js'),
	IeTransform = require('./stylecow/plugins/IeTransform.js'),
	Color = require('./stylecow/plugins/Color.js'),
	IeBackgroundAlpha = require('./stylecow/plugins/IeBackgroundAlpha.js'),
	IeLinearGradient = require('./stylecow/plugins/IeLinearGradient.js'),
	Variables = require('./stylecow/plugins/Variables.js'),
	IeClip = require('./stylecow/plugins/IeClip.js'),
	FFBorderRadius = require('./stylecow/plugins/FFBorderRadius.js'),
	LinearGradient = require('./stylecow/plugins/LinearGradient.js'),
	VendorPrefixes = require('./stylecow/plugins/VendorPrefixes.js');

var css = Stylecow.parseFile('./test.css');

NestedRules.apply(css);
Rem.apply(css);
IeClip.apply(css);
IeFloat.apply(css);
IeInlineBlock.apply(css);
IeMinHeight.apply(css);
Initial.apply(css);
Matches.apply(css);
IeOpacity.apply(css);
IeTransform.apply(css);
Color.apply(css);
IeBackgroundAlpha.apply(css);
IeLinearGradient.apply(css);
Variables.apply(css);
VendorPrefixes.apply(css);
FFBorderRadius.apply(css);
LinearGradient.apply(css);
*/

/*
BaseUrl
Grid
Math
MediaQuery
*/

//console.log(css.toString());
