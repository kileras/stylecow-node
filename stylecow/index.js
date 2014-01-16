var fs = require('fs');
var parser = require('./parser');
var utils = require('./utils');

var styleCow = function () {
	this.support = {
		'explorer': 8.0,
		'firefox': 15.0,
		'chrome': 25.0,
		'safari': 5.0,
		'opera': 12.0,
		'android': 4.0,
		'ios': 5.0
	};

	this.plugins = require('./plugins');
}

styleCow.prototype = {
	loadFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		this.css = parser.parseRuleset(code);

		return this;
	},
	transform: function () {
		var combinedPlugins = [];

		for (var name in this.plugins) {
			var plugin = this.plugins[name];

			if (plugin.enabled && (utils.needSupport(this.support, plugin.support))) {
				plugin.data = {};

				combinedPlugins.push(plugin);
			}
		}

		this.css.transform(combinedPlugins, this.support);

		return this;
	},
	toString: function () {
		return this.css.toString();
	}
};

module.exports = new styleCow();
