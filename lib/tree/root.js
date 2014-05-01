(function (tree) {
	var child = require('./child'),
		util = require('util'),
		utils = require('../utils'),
		plugins = require('../plugins');

	tree.root = function () {
		this.type = 'root';
		this.children = [];
		this.settings = null;

		child.call(this);
	};

	util.inherits(tree.root, child);

	tree.root.prototype.clone = function () {
		var copy = new tree.root();

		copy.sourceColLine = utils.clone(this.sourceColLine);
		copy.sourceFile = this.sourceFile;

		this.children.forEach(function (child) {
			copy.add(child.clone());
		});

		return copy;
	};

	tree.root.prototype.add = function (child, index, after) {
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

	tree.root.prototype.getRulesets = function (filter) {
		return this.children.filter(function (child) {
			return (child.type === 'ruleset' && (!filter || child.selector.is(filter)));
		});
	};

	tree.root.prototype.getRules = function (name, value) {
		return this.children.filter(function (child) {
			return (child.type === 'rule' && (!name || child.is(name, value)));
		});
	};

	tree.root.prototype.hasRule = function (name, value) {
		return this.children.some(function (child) {
			return (child.type === 'rule' && (!name || child.is(name, value)));
		});
	};

	tree.root.prototype.hasRuleset = function (filter) {
		return this.children.some(function (child) {
			return (child.type === 'ruleset' && (!filter || child.selector.is(filter)));
		});
	};

	tree.root.prototype.remove = function (index) {
		var child = this.children.splice(index, 1);

		if (child) {
			child[0].parent = null;
		}
	};

	tree.root.prototype.setCliSetting = function (setting) {
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

	tree.root.prototype.setSetting = function (name, value) {
		var settings = this.settings;

		switch (name) {
			case 'enable':
			case 'disable':
				if (!(value instanceof Array)) {
					if (value === 'all') {
						value = Object.keys(settings.plugins);
					} else {
						value = [value];
					}
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
	};

	tree.root.prototype.transform = function () {
		var k, plugin, data = {}, settings = this.settings;

		for (k in settings.plugins) {
			data[k] = {};
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

	tree.root.prototype.toString = function (options) {
		var string = '';

		this.children.forEach(function (child) {
			string += child.toString(options);
		});

		return string;
	};
})(require('../tree'));
