var parser = require('./parser');
var utils = require('./utils');
var info = require('./info');

var styleCow = function (code, debug) {
	this.support = utils.clone(info.defaults.support);
	this.plugins = require('./plugins');
	this.css = parser.parseRuleset(code);

	if (debug) {
		var i;

		for (i in this.support) {
			this.support[i] = 0;
		}
		for (i in this.plugins) {
			this.plugins[i].enabled = true;
		}
	}
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
	load: function (code, debug) {
		return new styleCow(code, debug);
	}
}
