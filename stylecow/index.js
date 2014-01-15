var fs = require('fs');
var parser = require('./parser');
var plugins = require('./plugins');

var styleCow = {
	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return parser.parseRuleset(code);
	},
	transform: function (css) {
		for (var name in plugins) {
			var plugin = plugins[name];

			if (plugin.support) {
				plugins[name](css);
			}
		}
	}
};

module.exports = styleCow;
