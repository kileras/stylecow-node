(function (tree) {
	var utils = require('../utils');
	var plugins = require('../plugins');

	tree.selector = function (type, selectors) {
		this.parent = null;
		this.type = type;
		this.selectors = [];
		this.vendor = null;

		if (selectors) {
			this.set(selectors);
		}
	};

	tree.selector.prototype = {
		clone: function () {
			var copy = new tree.selector(this.type, utils.clone(this.selectors));
			copy.vendor = this.vendor;

			return copy;
		},
		set: function (selectors) {
			if (selectors instanceof Array) {
				this.selectors = selectors;
			} else {
				this.selectors = [selectors];
			}
		},
		add: function (selector) {
			this.selectors.push(selector);
		},
		remove: function (key) {
			if (key) {
				if (this.selectors[key]) {
					this.selectors.splice(key, 1);
				}
			} else {
				this.selectors = [];
			}
		},
		is: function (value) {
			if (!(value instanceof Array)) {
				value = [value];
			}

			return this.selectors.some(function (selector) {
				return (value.indexOf(selector) !== -1);
			});
		},
		execute: function (settings, data, rootData) {
			var k, plugin;

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin.selector && (utils.needSupport(settings.support, plugin.support))) {
					plugin.selector.call(this, data[k], settings, rootData[k]);
				}
			}
		},
		setParent: function (parent) {
			this.parent = parent;
		},
		toString: function (options) {
			if (options === undefined) {
				return this.selectors.join(',');
			}

			var selector = this.selectors.join(options.selectorJoiner);

			if (this.parent.children.length) {
				return selector + options.rulesetStart;
			}

			if (this.type) {
				return selector + options.ruleEnd;
			}

			return '';
		}
	};

})(require('../tree'));
