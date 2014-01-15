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
	'initial',
	'linearGradient',
	'matches',
	'nestedRules',
	'rem',
	'variables',
	'vendorPrefixes'
	].forEach(function (pluginName) {
		require('./plugins/' + pluginName);
	});
})(require('./plugins'));