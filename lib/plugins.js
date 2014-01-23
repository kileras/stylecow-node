var plugins = {};

[
	'calc',
	'color',
	'ffBorderRadius',
	'ffFillAvailable',
	'ieBackgroundAlpha',
	'ieClip',
	'ieFloat',
	'ieInlineBlock',
	'ieLinearGradient',
	'ieMinHeight',
	'ieOpacity',
	'ieTransform',
	'import',
	'initial',
	'linearGradient',
	'matches',
	'nestedRules',
	'rem',
	'removeComments',
	'sourceMap',
	'variables',
	'vendorPrefixes',
	'vmin'
].forEach(function (pluginName) {
	plugins[pluginName] = require('./plugins/' + pluginName);
});

module.exports = plugins;

/*
- zoom: http://pastebin.com/gaVxatxh (https://github.com/pbakaus/transformie/blob/master/transformie.js)
- http://caniuse.com/#feat=multicolumn
- http://caniuse.com/#feat=intrinsic-width
- https://github.com/h5bp/html5please/blob/master/posts/pseudo-elements.md
*/