var fs = require('fs');

var styleCow = {
	tree: require('./tree'),
	parser: require('./parser'),

	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return this.parser.parseRuleset(code);
	}
};

module.exports = styleCow;
