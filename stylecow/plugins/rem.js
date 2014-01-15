var tree = require('../tree');

var valueToPixels = function (value) {
	if (value[0] === '.') {
		value = '0' + value;
	}

	if (value.indexOf('px') !== -1) {
		return parseInt(value, 10);
	}

	if (value.indexOf('em') !== -1) {
		return parseFloat(value, 10) * 16;
	}

	if (value.indexOf('pt') !== -1) {
		return parseFloat(value, 10) * 14;
	}

	return 16;
};

var remToPixels = function (value, rootPixels) {
	if (value[0] === '.') {
		value = '0' + value;
	}

	return (rootPixels * parseFloat(value, 10)) + 'px';
};

(function (plugins) {
	plugins.rem = function (css) {
		var rem = 16;

		css.getChildren([':root', 'html']).forEach(function (child) {
			child.getRules('font-size').forEach(function (rule) {
				rem = valueToPixels(rule.value);
			});
		});

		css.executeRecursive(function () {
			this.getRules().forEach(function (rule) {
				if (!rule.value || rule.value.indexOf('rem') === -1) {
					return false;
				}

				var value = rule.value.replace(/([0-9\.]+)rem/, function (match) {
					return remToPixels(match, rem);
				});

				if (rule.value !== value) {
					this.addRule(new tree.rule(rule.name, value), rule.index());
				}
			}, this);
		});
	};

	plugins.rem.support = {
		'firefox': 3.6,
		'explorer': 9.0,
		'safari': 5.0,
		'opera': 11.6,
		'ios': 4.0
	};

	plugins.rem.enabled = true;
})(require('../plugins'));
