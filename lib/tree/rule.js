(function (tree) {
	var utils = require('../utils');
	var plugins = require('../plugins');

	tree.rule = function (name, value) {
		this.type = 'rule';
		this.parent = null;
		this.vendor = null;
		this.name = null;
		this.value = null;

		this.set(name, value);
	};

	tree.rule.prototype = {
		clone: function () {
			var copy = new tree.rule(this.name, this.value);
			copy.vendor = this.vendor;

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
		execute: function (settings, data, rootData, vendor) {
			if (vendor && this.vendor && (vendor !== this.vendor)) {
				this.parent.remove(this.index());
				return;
			}

			var k, plugin;

			for (k in plugins) {
				plugin = plugins[k];

				if (settings.plugins[k].enabled && plugin.rule && (utils.needSupport(settings.support, plugin.support))) {
					plugin.rule.call(this, data[k], settings, rootData[k]);
				}
			}

			this.value = utils.executeFunctions(this.value, function (string) {
				var fnInfo = utils.getFunctionInfo(string);
				var name = fnInfo.name, fnresult, result, plugin;

				for (k in plugins) {
					plugin = plugins[k];

					if (settings.plugins[k].enabled && plugin.functions && plugin.functions[name] && (utils.needSupport(settings.support, plugin.support))) {
						fnresult = plugin.functions[name].call(this, {
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
			}, this);

			this.executed = true;
		},
		toString: function () {
			return this.name + ': ' + this.value;
		}
	}
})(require('../tree'));
