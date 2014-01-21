(function (tree) {
	var plugins = require('../plugins');
	var utils = require('../utils');

	tree.ruleset = function (selector) {
		this.type = 'ruleset';
		this.parent = null;
		this.vendor = null;
		this.selector = null;
		this.children = [];
		this.sourceColLine = [];
		this.sourceFile = '';
		this.settings = null;

		if (selector) {
			this.setSelector(selector);
		}
	};

	tree.ruleset.prototype = {
		clone: function () {
			var copy = new tree.ruleset(this.selector.clone());

			this.children.forEach(function (child) {
				copy.add(child.clone());
			});

			return copy;
		},
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
		add: function (child, index, after) {
			if (index === undefined || (after && index === this.children.length)) {
				this.children.push(child);
			} else {
				this.children.splice(after ? index + 1 : index, 0, child);
			}

			child.setParent(this);

			return child;
		},
		getRulesets: function (filter) {
			return this.children.filter(function (child) {
				return (child.type === 'ruleset' && (!filter || child.selector.is(filter)));
			});
		},
		getRules: function (name, value) {
			return this.children.filter(function (child) {
				return (child.type === 'rule' && (!name || child.is(name, value)));
			});
		},
		hasRule: function (name, value) {
			return this.children.some(function (child) {
				return (child.type === 'rule' && (!name || child.is(name, value)));
			});
		},
		hasRuleset: function (filter) {
			return this.children.some(function (child) {
				return (child.type === 'ruleset' && (!filter || child.selector.is(filter)));
			});
		},
		remove: function (index) {
			var child = this.children.splice(index, 1);

			if (child) {
				child[0].parent = null;
			}
		},
		addMsFilter: function (filter) {
			var rule = this.getRules('filter').pop();

			if (rule) {
				if (rule.value === 'none') {
					rule.value = filter;
				} else {
					rule.addValue(filter);
				}
				rule.vendor = 'ms';
			} else {
				this.add(new tree.rule('filter', filter)).vendor = 'ms';
			}
		},
		setSelector: function (selector) {
			this.selector = selector;
			this.selector.setParent(this);
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
		transform: function () {
			var k, plugin, data = {}, settings = this.getInherit('settings', true);

			for (k in settings.plugins) {
				data[k] = {};
			}

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin.init && (utils.needSupport(settings.support, plugin.support))) {
					plugin.init.call(this, data[k], settings);
				}
			}

			k = 0;

			while (this.children[k]) {
				var child = this.children[k];

				if (child.executed) {
					++k;
					continue;
				}

				child.execute(settings, data);

				k = 0;
			}
		},
		execute: function (settings, parentData) {
			var data = {}, k;

			for (var k in parentData) {
				data[k] = utils.clone(parentData[k]);
			}

			this.selector.execute(settings, data);

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin.ruleset && (utils.needSupport(settings.support, plugin.support))) {
					plugin.ruleset.call(this, data[k], settings);
				}
			}

			k = 0;

			while (this.children[k]) {
				var child = this.children[k];

				if (child.executed) {
					++k;
					continue;
				}

				child.execute(settings, data);

				k = 0;
			}

			this.executed = true;
		},
		toString: function (options) {
			options = utils.clone(options) || {};
			options.indent = options.indent || 0;

			var selector = this.selector ? this.selector.toString() : '',
				rules = '',
				comments = '',
				indentation = utils.repeat("\t", options.indent);

			comments += indentation + '/* ' + this.getInherit('sourceFile', true) + ':' + this.sourceColLine[1] + ' */\n';

			if (this.children.length) {
				var indProp = selector ? (indentation + "\t") : indentation;

				if (selector) {
					++options.indent;
				}

				this.children.forEach(function (child) {
					switch (child.type) {
						case 'comment':
						case 'ruleset':
							var string = child.toString(options);

							if (string) {
								rules += "\n" + string;
							}
							break;

						case 'rule':
						case 'import':
							rules += "\n" + indProp + child.toString() + ";";
							break;

						default:
							console.error('error: not valid type');
					}
				});
			}

			if (rules && selector) {
				return comments + indentation + selector + " {" + rules + "\n" + indentation + "}\n";
			}

			if (rules) {
				return rules;
			}

			if (selector && this.selector.type) {
				return comments + indentation + selector + ";\n";
			}

			return '';
		}
	}
})(require('../tree'));
