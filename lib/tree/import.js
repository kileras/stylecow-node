(function (tree) {
	tree.import = function (url) {
		this.type = 'import';
		this.parent = null;
		this.url = url;
	};

	tree.import.prototype = {
		toString: function () {
			return '@import "' + this.url + '"';
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
		}
	}

})(require('../tree'));
