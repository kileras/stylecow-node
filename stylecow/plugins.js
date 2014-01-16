var plugins = {};

[
	'ieMinHeight',
	'ieOpacity',
	'initial',
	'matches',
	'rem',
	'variables',
].forEach(function (pluginName) {
	plugins[pluginName] = require('./plugins/' + pluginName);
});

module.exports = plugins;

/*
(function (plugins) {
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
	
	'linearGradient',
	
	'nestedRules',
	
	'vendorPrefixes'
	].forEach(function (pluginName) {
		require('./plugins/' + pluginName);
	});
})(require('./plugins'));
*/