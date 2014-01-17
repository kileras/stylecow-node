var tree = require('../tree');

module.exports = {
	rule: function () {
		if (this.name === 'min-height' && !this.parent.hasRule(['_height', '*height', 'height'])) {
			this.parent.addRule(new tree.rule('_height', this.value), this.index()).vendor = 'ms';
		}
	},
	enabled: true,
	support: {
		'explorer': 7.0
	}
};
