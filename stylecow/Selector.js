(function (tree) {
	var utils = require('./utils.js');

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

			for (var i = 0, total = this.selectors.length; i < total; i++) {
				if (value.indexOf(this.selectors[i]) !== -1) {
					return true;
				}
			}

			return false;
		},
		setParent: function (parent) {
			this.parent = parent;
		},
		toString: function () {
			return this.selectors.join(', ');
		}
	}

})(require('./tree'));
