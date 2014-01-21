(function (tree) {
	var plugins = require('../plugins');
	var utils = require('../utils');

	tree.comment = function (text) {
		this.type = 'comment';
		this.parent = null;
		this.text = text;
		this.sourceColLine = [];
		this.sourceFile = '';
	};

	tree.comment.prototype = {
		setSourceColLine: function (col, line) {
			this.sourceColLine = [col, line];
		},
		setSourceFile: function (file) {
			this.sourceFile = file;
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
		execute: function (settings, data) {
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
					plugin.comment.call(this, data[k], settings);
				}
			}

			this.executed = true;
		},
		toString: function () {
			if (this.text) {
				return '/*' + this.text + '*/';
			}

			return '';
		}
	}

})(require('../tree'));
