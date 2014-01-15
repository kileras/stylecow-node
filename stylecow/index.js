var fs = require('fs');
var parser = require('./parser');
var plugins = require('./plugins');

var styleCow = {
	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return parser.parseRuleset(code);
	},
	transform: function (css) {
		plugins.rem(css);
	}
};

module.exports = styleCow;
