var tree = require('../tree');

module.exports = {
	rule: function () {
		if (!this.is('display', 'inline-block')) {
			return;
		}

		if (!this.parent.hasRule(['zoom', '*zoom'])) {
			this.parent.addRule(new tree.rule('*zoom', '1'), this.index(), true).vendor = 'ms';
		}

		if (!this.parent.hasRule('*display')) {
			this.parent.addRule(new tree.rule('*display', 'inline'), this.index(), true);
		}
	},
	enabled: true,
	support: {
		'explorer': 8.0
	}
};
