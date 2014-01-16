var fs = require('fs');
var parser = require('./parser');
var utils = require('./utils');

var styleCow = {
	support: {
		'explorer': 8.0,
		'firefox': 15.0,
		'chrome': 25.0,
		'safari': 5.0,
		'opera': 12.0,
		'android': 4.0,
		'ios': 5.0
	},
	plugins: require('./plugins'),
	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return parser.parseRuleset(code);
	},
	transform: function (css) {
		var combinedPlugins = [];

		for (var name in styleCow.plugins) {
			var plugin = styleCow.plugins[name];

			plugin.data = {};

			combinedPlugins.push(plugin);
		}

		css.transform(combinedPlugins);
	}
};

module.exports = styleCow;
