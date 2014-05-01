(function (tree) {
	var child = require('./child'),
		util = require('util'),
		utils = require('../utils'),
		plugins = require('../plugins');

	var executePluginFunctions = function (rule, settings, data, rootData, pluginsProperty) {
		rule.value = utils.executeFunctions(rule.value, function (string) {
			var fnInfo = utils.getFunctionInfo(string);
			var name = fnInfo.name, fnresult, result, k, plugin;

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin[pluginsProperty] && plugin[pluginsProperty][name] && (utils.needSupport(settings.support, plugin.support))) {
					fnresult = plugin[pluginsProperty][name].call(this, {
						string: fnInfo.string,
						name: fnInfo.name,
						params: utils.clone(fnInfo.params)
					}, data[k], settings, rootData[k]);

					if (fnresult !== undefined) {
						if (fnresult.indexOf('(') !== -1) {
							fnInfo = utils.getFunctionInfo(fnresult);
							name = fnInfo.name;
						}

						result = fnresult;
					}
				}
			}

			return result;
		}, rule);
	};

	tree.rule = function (name, value) {
		this.type = 'rule';
		this.name = null;
		this.value = null;

		child.call(this);

		this.set(name, value);
	};

	util.inherits(tree.rule, child);

	tree.rule.prototype.clone = function () {
		var copy = new tree.rule(this.name, this.value);
		copy.vendor = this.vendor;

		return copy;
	};
	
	tree.rule.prototype.set = function (name, value) {
		var vendor = name.match(/^\-(\w+)\-/) || value.match(/^\-(\w+)\-/);

		this.name = name;
		this.value = value;
		this.vendor = vendor ? vendor[0] : null;
	};

	tree.rule.prototype.addValue = function (value) {
		var arrValue = utils.explodeTrim(',', this.value);

		if (arrValue.indexOf(value) === -1) {
			arrValue.push(value);
		}

		this.value = arrValue.join(',');
	};
	
	tree.rule.prototype.is = function (name, value) {
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
	};
	
	tree.rule.prototype.execute = function (settings, data, rootData, vendor) {
		if (vendor && this.vendor && (vendor !== this.vendor)) {
			this.parent.remove(this.index());
			return;
		}

		executePluginFunctions(this, settings, data, rootData, 'beforeRuleFunctions');

		var k, plugin;

		for (k in plugins) {
			plugin = plugins[k];

			if (settings.plugins[k].enabled && plugin.rule && (utils.needSupport(settings.support, plugin.support))) {
				plugin.rule.call(this, data[k], settings, rootData[k]);
			}
		}

		executePluginFunctions(this, settings, data, rootData, 'functions');

		this.executed = true;
	};
	
	tree.rule.prototype.toString = function (options) {
		return this.name + options.ruleColon + this.value + options.ruleEnd;
	};
})(require('../tree'));
