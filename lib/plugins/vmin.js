var tree = require('../tree');

module.exports = {
	rule: function () {
		if (!this.value || this.value.indexOf('vmin') === -1) {
			return false;
		}

		var value = this.value.replace(/([0-9\.]+)vmin/, function (match) {
			return parseFloat(match, 10) + 'vm';
		});

		if (this.value !== value) {
			this.parent.add(new tree.rule(this.name, value), this.index());
		}
	},
	enabled: true,
	description: 'Add a ie9 fallback that support vm instead vmin',
	support: {
		'explorer': 10.0
	}
};
