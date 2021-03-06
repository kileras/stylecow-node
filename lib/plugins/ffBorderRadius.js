var tree = require('../tree');

module.exports = {
	rule: function () {
		var newName;

		switch (this.name) {
			case 'border-top-left-radius':
				newName = '-moz-border-radius-topleft';
				break;

			case 'border-top-right-radius':
				newName = '-moz-border-radius-topright';
				break;

			case 'border-bottom-left-radius':
				newName = '-moz-border-radius-bottomleft';
				break;

			case 'border-bottom-right-radius':
				newName = '-moz-border-radius-bottomright';
				break;

			default:
				return;
		}

		this.parent.add(new tree.rule(newName, this.value), this.index());
	},
	enabled: true,
	description: 'Add the old border-[*]-radius syntax in firefox < 13',
	support: {
		'firefox': 13.0
	}
};
