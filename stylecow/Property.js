var Utils = require('./Utils.js');

function Property (name, value) {
	this.parent = null;
	this.name = null;
	this.value = null;
	this.vendor = null;
	this.comments = [];

	this.set(name, value);
}

Property.prototype = {
	set: function (name, value) {
		this.name = name;
		this.value = value;

		var match = name.match(/^\-(\w+)\-/);

		this.vendor = match ? match[0] : null;
	},
	setParent: function (parent) {
		this.parent = parent;
	},
	toString: function () {
		comments = this.comments.length ? ' /*' + this.comments.join(', ') + '*/' : '';

		return this.name + ': ' + this.value + comments;
	}
}

module.exports = {
	create: function (name, value) {
		return new Property(name, value);
	},
	createFromString: function (string) {
		var pieces = Utils.explodeTrim(':', string, 2);

		return new Property(pieces[0], pieces[1]);
	}
};