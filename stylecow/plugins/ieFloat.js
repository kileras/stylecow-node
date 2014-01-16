var tree = require('../tree');

module.exports = {
	rule: function () {
		if (this.is('float', ['right', 'left']) && !this.parent.hasRule(['display', '_display', '*display'], 'inline')) {
			this.parent.addRule(new tree.rule('_display', 'inline'), this.index(), true).vendor = 'ms';
		}
	},
	enabled: true,
	support: {
		'explorer': 7.0
	}
};
