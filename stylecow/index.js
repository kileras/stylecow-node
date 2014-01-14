var fs = require('fs');
var parser = require('./parser');

var styleCow = {
	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return parser.parseRuleset(code);
	}
};

module.exports = styleCow;
