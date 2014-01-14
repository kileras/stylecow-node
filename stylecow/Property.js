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
	clone: function () {
		var copy = new Property(this.name, this.value);
		copy.vendor = this.vendor;
		copy.comments = Utils.clone(this.comments);

		return copy;
	},
	set: function (name, value) {
		this.name = name;
		this.value = value;

		var match = name.match(/^\-(\w+)\-/);

		this.vendor = match ? match[0] : null;
	},
	is: function (name, value) {
		if (name instanceof Array) {
			if (name.indexOf(this.name) === -1) {
				return false;
			}
		} else if (this.name !== name) {
			return false;
		}

		if (value) {
			if (value instanceof Array) {
				if (value.indexOf(this.value) === -1) {
					return false;
				}
			} else if (this.value !== value) {
				return false;
			}
		}

		return true;
	},
	addValue: function (value) {
		if (this.value) {
			var values = Utils.explode(',', this.value);

			if (values.indexOf(value) === -1) {
				this.value += ', ' + value;
			}
		} else {
			this.value = value;
		}
	},
	setParent: function (parent) {
		this.parent = parent;
	},
	index: function () {
		if (this.parent) {
			return this.parent.properties.indexOf(this);
		}

		return -1;
	},
	addComment: function (comment) {
		if (comment) {
			this.comments.push(comment);
		}

		return this;
	},
	executeFunctions: function (callback, name) {
		this.value = Utils.executeFunctions(this.value, name, callback, this);
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