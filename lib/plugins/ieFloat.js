var tree = require('../tree');

module.exports = {
	rule: function () {
		if (this.is('float', ['right', 'left']) && !this.parent.hasRule(['display', '_display', '*display'], 'inline')) {
			this.parent.add(new tree.rule('_display', 'inline'), this.index(), true).vendor = 'ms';
		}
	},
	enabled: true,
	description: 'Fix the double margin bug in ie6 on float block elements',
	support: {
		'explorer': 7.0
	}
};
