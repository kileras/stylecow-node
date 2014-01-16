var plugins = {};

[
	'color',
	'ffBorderRadius',
	'ieBackgroundAlpha',
	'ieClip',
	'ieFloat',
	'ieInlineBlock',
	'ieLinearGradient',
	'ieMinHeight',
	'ieOpacity',
	'ieTransform',
	'initial',
	'linearGradient',
	'matches',
	'nestedRules',
	'rem',
	'variables',
	'vendorPrefixes'
].forEach(function (pluginName) {
	plugins[pluginName] = require('./plugins/' + pluginName);
});

module.exports = plugins;
