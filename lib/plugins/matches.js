var utils = require('../utils');

var resolveMatches = function (selector, key) {
	var match = selector.match(/:matches\(([^\)]*)\)/);

	if (match) {
		this.remove(key);

		utils.explodeTrim(',', match[1]).forEach(function (matchSelector) {
			this.add(selector.replace(match[0], matchSelector));
		}, this);
	}
};

module.exports = {
	selector: function () {
		while (this.toString().indexOf(':matches(') !== -1) {
			this.selectors.forEach(resolveMatches, this);
		}
	},
	enabled: true,
	description: 'Add support for :matches() selector function to all browsers',
};
