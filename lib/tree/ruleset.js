(function (tree) {
	var util = require('util'),
		utils = require('../utils'),
		plugins = require('../plugins');

	tree.ruleset = function (selector) {
		tree.root.call(this);
		this.setSelector(selector);

		this.type = 'ruleset';
	};

	util.inherits(tree.ruleset, tree.root);

	tree.ruleset.prototype.clone = function () {
		var copy = new tree.ruleset(this.selector.clone());

		copy.sourceColLine = utils.clone(this.sourceColLine);
		copy.sourceFile = this.sourceFile;

		this.children.forEach(function (child) {
			copy.add(child.clone());
		});

		return copy;
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

		for (k in parentData) {
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
		var string = '';

		if (this.children.length) {
			this.children.forEach(function (child) {
				string += child.toString(options, indent + 1);
			});

			if (options.rulesetIndent) {
				string = options.rulesetIndent + string.replace(/\n/g, "\n" + options.rulesetIndent);

				//Remove the last indent
				if (string.substr(-options.rulesetIndent.length) === options.rulesetIndent) {
					string = string.slice(0, -options.rulesetIndent.length);
				}
			}

			string += options.rulesetEnd;
		}

		string = this.selector.toString(options) + string;

		if (indent) {
			var indentation = utils.repeat(options.rulesetIndent, indent);

			return indentation + string.replace(/\n/g, "\n" + indentation);
		}

		return string;
	};
})(require('../tree'));
