(function (tree) {
	var utils = require('../utils');

	var repeat = function (pattern, count) {
		var result = '';

		while (count > 0) {
			result += pattern;
			count--;
		}

		return result;
	};

	var executePlugins = function (plugins, name, thisParam, support) {
		plugins.forEach(function (plugin) {
			if (plugin[name]) {
				plugin[name].call(thisParam, plugin.data, support);
			}
		});
	};

	tree.ruleset = function (selector) {
		this.parent = null;
		this.selector = null;
		this.rules = [];
		this.children = [];
		this.comments = [];
		this.vendor = null;

		if (selector) {
			this.setSelector(selector);
		}
	};

	tree.ruleset.prototype = {
		clone: function () {
			var copy = new tree.ruleset(this.selector.clone());

			this.rules.forEach(function (rule) {
				copy.addRule(rule.clone());
			});

			this.children.forEach(function (child) {
				copy.addChild(child.clone());
			});

			copy.comments = utils.clone(this.comments);

			return copy;
		},
		addChild: function (child, index, after) {
			if (index === undefined || (after && index === this.children.length)) {
				this.children.push(child);
			} else {
				this.children.splice(after ? index + 1 : index, 0, child);
			}

			child.setParent(this);

			return child;
		},
		getChildren: function (filter) {
			if (!filter) {
				return utils.clone(this.children);
			}

			var children = [];

			this.children.forEach(function (child) {
				if (child.selector.is(filter)) {
					children.push(child);
				}
			});

			return children;
		},
		getRules: function (name, value) {
			if (!name) {
				return utils.clone(this.rules);
			}

			var rules = [];

			this.rules.forEach(function (rule) {
				if (rule.is(name, value)) {
					rules.push(rule);
				}
			});

			return rules;
		},
		hasRule: function (name, value) {
			for (var i = 0, total = this.rules.length; i < total; i++) {
				if (this.rules[i].is(name, value)) {
					return true;
				}
			}

			return false;
		},
		addRule: function (rule, index, after) {
			if (index === undefined || (after && index === this.rules.length)) {
				this.rules.push(rule);
			} else {
				this.rules.splice(after ? index + 1 : index, 0, rule);
			}

			rule.setParent(this);

			return rule;
		},
		removeRule: function (index) {
			this.rules.splice(index, 1);
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
				this.addRule(new tree.rule('filter', filter)).vendor = 'ms';
			}
		},
		setSelector: function (selector) {
			this.selector = selector;
			this.selector.setParent(this);
		},
		setParent: function (parent) {
			if (this.parent && this.parent.children.length) {
				var children = this.parent.children;

				for (var i = 0, total = children.length; i < total; i++) {
					if (children[i] === this) {
						children.splice(i, 1);
						break;
					}
				}
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
		transform: function (plugins, support) {
			executePlugins(plugins, 'children', this, support);

			if (this.selector) {
				executePlugins(plugins, 'selector', this.selector, support);
			} else if (!this.parent) {
				executePlugins(plugins, 'init', this, support);
			}

			var k = 0;

			this.getRules().forEach(function (rule) {
				rule.value = utils.executeFunctions(rule.value, function (fnInfo) {
					var name = fnInfo.name;
					var result;

					plugins.forEach(function (plugin) {
						if (plugin.functions && plugin.functions[name]) {
							result = plugin.functions[name].call(rule, {
								string: fnInfo.string,
								name: fnInfo.name,
								params: utils.clone(fnInfo.params)
							}, plugin.data, support);
						}
					});

					return result;
				});

				executePlugins(plugins, 'rule', rule, support);
			});

			this.getChildren().forEach(function (child) {
				child.transform(plugins, support);
			});
		},
		toString: function (options) {
			options = utils.clone(options) || {};
			options.indent = options.indent || 0;

			var selector = this.selector ? this.selector.toString() : '',
				rules = '',
				comments = '',
				indentation = repeat("\t", options.indent);

			if (options.comments && this.comments.length) {
				comments = indentation + '/*' + this.comments.join("\n") + '*/' + "\n";
			}

			if (this.rules.length) {
				var indProp = selector ? (indentation + "\t") : indentation;

				this.rules.forEach(function (rule) {
					rules += "\n" + indProp + rule.toString() + ";";
				});
			}

			if (this.children.length) {
				if (selector) {
					++options.indent;
				}

				this.children.forEach(function (child) {
					var string = child.toString(options);

					if (string) {
						rules += "\n" + string;
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
