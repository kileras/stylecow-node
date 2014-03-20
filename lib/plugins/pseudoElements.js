var utils = require('../utils');

module.exports = {
	selector: function () {
		this.selectors.forEach(function (selector, key) {
			this.selectors[key] = selector.replace(/^(.*[^:]):(after|before)$/, "$1::$2");
		}, this);
	},
	enabled: true,
	description: 'Add support to ::before and ::after selectors to ie < 9',
	support: {
		'explorer': 9.0
	}
};
