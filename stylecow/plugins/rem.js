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

module.exports = {
	init: function (data) {
		data.rem = 16;

		this.getChildren([':root', 'html']).forEach(function (ruleset) {
			ruleset.getRules('font-size').forEach(function (rule) {
				data.rem = valueToPixels(rule.value);
			});
		});
	},

	rule: function (data) {
		if (!this.value || this.value.indexOf('rem') === -1) {
			return false;
		}

		var value = this.value.replace(/([0-9\.]+)rem/, function (match) {
			return remToPixels(match, data.rem);
		});

		if (this.value !== value) {
			this.parent.addRule(new tree.rule(this.name, value), this.index());
		}
	},
	enabled: true,
	support: {
		'firefox': 3.6,
		'explorer': 9.0,
		'safari': 5.0,
		'opera': 11.6,
		'ios': 4.0
	}
};

