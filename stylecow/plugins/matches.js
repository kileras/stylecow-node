var utils = require('../utils');

module.exports = {
	selector: function () {
		while (this.toString().indexOf(':matches(') !== -1) {
			this.selectors.forEach(function (selector, key) {
				var match = selector.match(/:matches\(([^\)]*)\)/);

				if (match) {
					this.remove(key);

					utils.explodeTrim(',', match[1]).forEach(function (matchSelector) {
						this.add(selector.replace(match[0], matchSelector));
					}, this);
				}
			}, this);
		}
	},
	enabled: true
};
