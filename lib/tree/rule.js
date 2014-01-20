(function (tree) {
	var utils = require('../utils');

	tree.rule = function (name, value) {
		this.type = 'rule';
		this.parent = null;
		this.vendor = null;
		this.name = null;
		this.value = null;
		this.comments = [];

		this.set(name, value);
	};

	tree.rule.prototype = {
		clone: function () {
			var copy = new tree.rule(this.name, this.value);
			copy.vendor = this.vendor;
			copy.comments = utils.clone(this.comments);

			return copy;
		},
		set: function (name, value) {
			this.name = name || '';
			this.value = value || '';

			var vendor = this.name.match(/^\-(\w+)\-/) || this.value.match(/^\-(\w+)\-/);

			this.vendor = vendor ? vendor[0] : null;
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
				var values = utils.explode(',', this.value);

				if (values.indexOf(value) === -1) {
					this.value += ', ' + value;
				}
			} else {
				this.value = value;
			}
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
		addComment: function (comment) {
			if (comment) {
				this.comments.push(comment);
			}

			return this;
		},
		execute: function (plugins, data, support) {
			var k;

			for (k in plugins) {
				if (plugins[k].rule) {
					plugins[k].rule.call(this, data[k], support);
				}
			}

			this.value = utils.executeFunctions(this.value, function (fnInfo) {
				var name = fnInfo.name, result, plugin;

				for (k in plugins) {
					plugin = plugins[k];

					if (plugin.functions && plugin.functions[name]) {
						result = plugin.functions[name].call(this, {
							string: fnInfo.string,
							name: fnInfo.name,
							params: utils.clone(fnInfo.params)
						}, data[k], support);
					}
				}

				return result;
			}, this);

			this.executed = true;
		},
		toString: function () {
			comments = this.comments.length ? ' /*' + this.comments.join(', ') + '*/' : '';

			return this.name + ': ' + this.value + comments;
		}
	}
})(require('../tree'));
