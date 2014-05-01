var plugins = {};

[
	'calc',
	'color',
	'ffBorderRadius',
	'ffFillAvailable',
	'fullscreen',
	'ieBackgroundAlpha',
	'ieClip',
	'ieFlex',
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
	'pseudoElements',
	'rem',
	'sourceMap',
	'variables',
	'vendorPrefixes',
	'vmin'
].forEach(function (pluginName) {
	plugins[pluginName] = require('./plugins/' + pluginName);
});

module.exports = plugins;

/*
- http://caniuse.com/#feat=multicolumn
- https://github.com/h5bp/html5please/blob/master/posts/pseudo-elements.md
*/