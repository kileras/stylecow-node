var fs = require('fs');
var parser = require('./parser');
var utils = require('./utils');
var plugins = require('./plugins');

styleCow = {
	defaults: {
		support: {
			'explorer': 8.0,
			'firefox': 15.0,
			'chrome': 25.0,
			'safari': 5.0,
			'opera': 12.0,
			'android': 4.0,
			'ios': 5.0
		}
	},
	load: function (code, debug) {
		var k, css = parser.parseRuleset(code);

		css.settings = {
			support: utils.clone(styleCow.defaults.support),
			plugins: {}
		}

		for (k in plugins) {
			css.settings.plugins[k] = {
				enabled: plugins[k].enabled
			}
		}

		if (debug) {
			for (k in css.settings.support) {
				css.settings.support[k] = 0;
			}

			for (k in css.settings.plugins) {
				css.settings.plugins[k].enabled = true;
			}
		}

		css.info = {};

		return css;
	},
	loadFile: function (file, debug) {
		var css = styleCow.load(fs.readFileSync(file, 'utf8'), debug);

		css.setSourceFile(file);
		css.info.files = [file];

		return css;
	}
}

module.exports = styleCow;
