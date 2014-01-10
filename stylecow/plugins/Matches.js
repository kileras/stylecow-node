var Utils = require('../Utils.js');

var apply = function (options) {
	this.executeRecursive(function () {
		while (this.selector.toString().indexOf(':matches(') !== -1) {
			this.selector.selectors.forEach(function (selector, key) {
				var match = selector.match(/:matches\(([^\)]*)\)/);

				if (match) {
					this.selector.remove(key);

					Utils.explodeTrim(',', match[1]).forEach(function (matchSelector) {
						this.selector.add(selector.replace(match[0], matchSelector));
					}, this);
				}
			}, this);
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};