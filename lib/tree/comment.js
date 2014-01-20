(function (tree) {
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
		execute: function (plugins, data, support) {
			var k;

			for (k in plugins) {
				if (plugins[k]['comment']) {
					plugins[k]['comment'].call(this, data[k], support);
				}
			}

			this.executed = true;
		},
		toString: function () {
			if (this.text) {
				return '/*' + this.text + '*/\n';
			}

			return '';
		}
	}

})(require('../tree'));
