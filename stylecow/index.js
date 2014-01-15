var fs = require('fs');
var parser = require('./parser');
var plugins = require('./plugins');
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
	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return parser.parseRuleset(code);
	},
	transform: function (css) {
		for (var name in plugins) {
			var plugin = plugins[name];

			if (!plugin.enabled) {
				continue;
			}

			if (!plugin.support || utils.needSupport(styleCow.support, plugin.support)) {
				plugin(css, styleCow.support);
			}
		}
	}
};

module.exports = styleCow;
