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
	description: 'Fix the old syntax of clip: rect(...) in ie < 8',
	support: {
		'explorer': 8.0
	}
};
