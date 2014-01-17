var tree = require('../tree');

module.exports = {
	rule: function () {
		if (this.name === 'clip') {
			var value = this.value.replace(/\s+/g, '').replace(/,/g, ' ');

			if (!this.parent.hasRule(['clip', '*clip'], value)) {
				this.parent.addRule(new tree.rule('*clip', value), this.index(), true).vendor = 'ms';
			}
		}
	},
	enabled: true,
	support: {
		'explorer': 8.0
	}
};
