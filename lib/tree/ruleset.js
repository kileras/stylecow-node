(function (tree) {
	var child = require('./child'),
		util = require('util'),
		utils = require('../utils'),
		plugins = require('../plugins');

	tree.ruleset = function (selector) {
		this.type = 'ruleset';
		this.selector = null;
		this.children = [];
		this.settings = null;

		child.call(this);

		if (selector) {
			this.setSelector(selector);
		}
	};

	util.inherits(tree.ruleset, child);

	tree.ruleset.prototype.clone = function () {
		var copy = new tree.ruleset(this.selector.clone());

		copy.sourceColLine = utils.clone(this.sourceColLine);
		copy.sourceFile = this.sourceFile;

		this.children.forEach(function (child) {
			copy.add(child.clone());
		});

		return copy;
	};

	tree.ruleset.prototype.add = function (child, index, after) {
		if ((child.type === 'rule') && this.hasRule(child.name, child.value)) {
			return child;
		}

		if (index === undefined || (after && index === this.children.length)) {
			this.children.push(child);
		} else {
			this.children.splice(after ? index + 1 : index, 0, child);
		}

		child.setParent(this);

		return child;
	};

	tree.ruleset.prototype.getRulesets = function (filter) {
		return this.children.filter(function (child) {
			return (child.type === 'ruleset' && (!filter || child.selector.is(filter)));
		});
	};

	tree.ruleset.prototype.getRules = function (name, value) {
		return this.children.filter(function (child) {
			return (child.type === 'rule' && (!name || child.is(name, value)));
		});
	};

	tree.ruleset.prototype.hasRule = function (name, value) {
		return this.children.some(function (child) {
			return (child.type === 'rule' && (!name || child.is(name, value)));
		});
	};

	tree.ruleset.prototype.hasRuleset = function (filter) {
		return this.children.some(function (child) {
			return (child.type === 'ruleset' && (!filter || child.selector.is(filter)));
		});
	};

	tree.ruleset.prototype.remove = function (index) {
		var child = this.children.splice(index, 1);

		if (child) {
			child[0].parent = null;
		}
	};

	tree.ruleset.prototype.addMsFilter = function (filter) {
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
	};

	tree.ruleset.prototype.setSelector = function (selector) {
		this.selector = selector;
		this.selector.setParent(this);
	};

	tree.ruleset.prototype.setCliSetting = function (setting) {
		var match = setting.match(/^--?([a-z][0-9a-z\.]*)(?:=(.*))?$/i);

		if (!match) {
			return false;
		}

		var name = match[1],
			value = match[2];

		if (value.indexOf(',') !== -1) {
			value = value.split(',');
		}

		if (name.indexOf('.') !== -1) {
			var pieces = name.split('.', 2), oldvalue = value;
			name = pieces[0];
			value = {};
			value[pieces[1]] = oldvalue;
		}

		return this.setSetting(name, value);
	};

	tree.ruleset.prototype.setSetting = function (name, value) {
		var settings = this.getInherit('settings');

		switch (name) {
			case 'enable':
			case 'disable':
				if (!(value instanceof Array)) {
					value = [value];
				}

				value.forEach(function (val) {
					if (!settings.plugins[val]) {
						console.error('The plugin "' + val + '" is missing');
						return false;
					}

					settings.plugins[val].enabled = (name === 'enable');
				});
				return true;

			default:
				if (settings.support[name] !== undefined) {
					settings.support[name] = parseFloat(value);
					return true;
				}

				if ((settings.plugins[name] !== undefined) && (value instanceof Object)) {
					for (var key in value) {
						settings.plugins[name][key] = value[key];
					}

					return true;
				}

				console.error('Unrecognised argument "' + name + '" or invalid value');
		}
	}

	tree.ruleset.prototype.transform = function () {
		var k, plugin, data = {}, settings = this.getInherit('settings');

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

			child.execute(settings, data, data);

			k = 0;
		}
	};

	tree.ruleset.prototype.execute = function (settings, parentData, rootData, vendor) {
		var thisVendor;

		if (this.vendor) {
			thisVendor = this.vendor;
		} else if (this.selector && this.selector.vendor) {
			thisVendor = this.selector.vendor;
		}

		if (!vendor) {
			vendor = thisVendor;
		} else if (vendor === thisVendor) {
			this.parent.remove(this.index());
			return;
		}

		var data = {}, k;

		for (var k in parentData) {
			data[k] = utils.clone(parentData[k]);
		}

		this.selector.execute(settings, data, rootData, vendor);

		for (k in plugins) {
			plugin = plugins[k];

			if (settings.plugins[k].enabled && plugin.ruleset && (utils.needSupport(settings.support, plugin.support))) {
				plugin.ruleset.call(this, data[k], settings, rootData[k]);
			}
		}

		k = 0;

		while (this.children[k]) {
			var child = this.children[k];

			if (child.executed) {
				++k;
				continue;
			}

			child.execute(settings, data, rootData, vendor);

			k = 0;
		}

		this.executed = true;
	};

	tree.ruleset.prototype.toString = function (options, indent) {
		indent = indent || -1;

		var string = this.selector ? this.selector.toString(options, indent) : '';

		if (this.children.length) {
			this.children.forEach(function (child) {
				switch (child.type) {
					case 'comment':
					case 'rule':
					case 'import':
						string += child.toString(options);
						break;

					case 'ruleset':
						string += child.toString(options, indent + 1);
						break;

					default:
						console.error('error: not valid type');
				}
			});

			if (this.parent) {
				string += options.rulesetEnd;
			}
		}

		if (indent > 0) {
			var indentation = utils.repeat(options.rulesetIndent, indent);

			return indentation + string.replace(/\n/g, "\n" + indentation);
		}

		return string;
	};
})(require('../tree'));
