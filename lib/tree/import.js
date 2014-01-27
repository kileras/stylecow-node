(function (tree) {
	var child = require('./child'),
		util = require('util'),
		utils = require('../utils'),
		plugins = require('../plugins');

	tree.import = function (url) {
		this.type = 'import';
		this.url = url;

		child.call(this);
	};

	util.inherits(tree.import, child);

	tree.import.prototype = {
		execute: function (settings, data, rootData) {
			var k, plugin;

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin['import'] && (utils.needSupport(settings.support, plugin.support))) {
					plugin['import'].call(this, data[k], settings, rootData[k]);
				}
			}

			this.executed = true;
		},
		toString: function () {
			return '@import "' + this.url + '"';
		}
	}

})(require('../tree'));
