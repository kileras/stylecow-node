(function (tree) {
	tree.import = function (file) {
		this.type = 'import';
		this.parent = null;
		this.sourceColLine = [];

		this.setSourceFile(file);
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
		execute: function (plugins, data, support) {
			var k;

			for (k in plugins) {
				if (plugins[k]['import']) {
					plugins[k]['import'].call(this, data[k], support);
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
			return '/* ' + this.sourceFile + ':' + this.sourceColLine[1] + ' */\n'
				+ '@import "' + this.url + '"';
		}
	}

})(require('../tree'));
