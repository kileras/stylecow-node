(function (tree) {
	var plugins = require('../plugins');
	var utils = require('../utils');

	tree.import = function (url) {
		this.type = 'import';
		this.parent = null;
		this.url = url;
		this.sourceColLine = [];
	};

	tree.import.prototype = {
		setSourceColLine: function (col, line) {
			this.sourceColLine = [col, line];
		},
		setSourceFile: function (file) {
			this.sourceFile = file;
		},
		getInherit: function (name, includeSelf) {
			var parent = includeSelf ? this : this.parent;

			while (parent) {
				if (parent[name]) {
					return parent[name];
				}

				parent = parent.parent;
			}

			return '';
		},
		execute: function (settings, data) {
			var k, plugin;

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin['import'] && (utils.needSupport(settings.support, plugin.support))) {
					plugin['import'].call(this, data[k], settings);
				}
			}

			this.executed = true;
		},
		setParent: function (parent) {
			var index = this.index();

			if (index !== -1) {
				this.parent.children.splice(index, 1);
			}
			
			this.parent = parent;
		},
		index: function () {
			if (this.parent) {
				return this.parent.children.indexOf(this);
			}

			return -1;
		},
		toString: function () {
			return '@import "' + this.url + '"';
		}
	}

})(require('../tree'));
