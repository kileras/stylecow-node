var child = function () {
	this.parent = null;
	this.vendor = null;
	this.sourceColLine = [];
	this.sourceFile = '';
};

child.prototype = {
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
	getInherit: function (name) {
		if (this[name]) {
			return this[name];
		}

		if (this.parent) {
			return this.parent.getInherit(name);
		}

		return '';
	}
}

module.exports = child;