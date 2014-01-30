(function (tree) {
	var child = require('./child'),
		util = require('util'),
		utils = require('../utils'),
		plugins = require('../plugins');

	tree.comment = function (text, important) {
		this.type = 'comment';
		this.text = text;
		this.important = important;

		if (this.text[0] === '!') {
			this.important = true;
			this.text.substr(1);
		}

		child.call(this);
	};

	util.inherits(tree.comment, child);

	tree.comment.prototype.execute = function (settings, data, rootData) {
		var k, plugin;

		var matches = this.text.match(/^\s*stylecow (.*)/);

		if (matches) {
			utils.explodeTrim(' ', matches[1]).forEach(function (setting) {
				this.setSetting(setting)
			}, this.parent);
		}

		for (k in plugins) {
			plugin = plugins[k];

			if (settings.plugins[k].enabled && plugin.comment && (utils.needSupport(settings.support, plugin.support))) {
				plugin.comment.call(this, data[k], settings, rootData[k]);
			}
		}

		this.executed = true;
	};

	tree.comment.prototype.toString = function () {
		if (this.text) {
			return '/*' + (this.important ? '! ' : ' ') + this.text + ' */';
		}

		return '';
	};

})(require('../tree'));
