var Utils = require('./Utils.js');

function Selector (type, selectors) {
	this.parent = null;
	this.type = type;
	this.selectors = [];
	this.vendor = null;

	if (selectors) {
		this.set(selectors);
	}
}

Selector.prototype = {
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
		return (this.type ? this.type + ' ' : '') + this.selectors.join(', ');
	}
}

module.exports = {
	create: function (type, selectors) {
		return new Selector(type, selectors);
	},
	createFromString: function (string) {
		string = string.trim();

		if (string[0] === '@') {
			var pieces = Utils.explodeTrim(' ', string, 2);

			return new Selector(pieces[0], pieces[1] ? Utils.explodeTrim(',', pieces[1]) : null);
		}

		return new Selector(null, Utils.explodeTrim(',', string));
	}
};