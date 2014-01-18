var parser = require('./parser');
var utils = require('./utils');

var styleCow = function (code) {
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
	this.css = parser.parseRuleset(code);
}

styleCow.prototype = {
	transform: function () {
		var plugins = {};
		var data = {};

		for (var name in this.plugins) {
			var plugin = this.plugins[name];

			if (plugin.enabled && (utils.needSupport(this.support, plugin.support))) {
				plugins[name] = plugin;
				data[name] = {};
			}
		}

		this.css.transform(plugins, data, this.support);

		return this;
	},
	toString: function () {
		return this.css.toString();
	}
};

module.exports = {
	load: function (code) {
		return new styleCow(code);
	}
}
