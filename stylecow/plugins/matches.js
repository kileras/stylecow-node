var utils = require('../utils');

(function (plugins) {
	plugins.matches = function (css) {
		css.executeRecursive(function () {
			if (!this.selector) {
				return;
			}

			while (this.selector.toString().indexOf(':matches(') !== -1) {
				this.selector.selectors.forEach(function (selector, key) {
					var match = selector.match(/:matches\(([^\)]*)\)/);

					if (match) {
						this.selector.remove(key);

						utils.explodeTrim(',', match[1]).forEach(function (matchSelector) {
							this.selector.add(selector.replace(match[0], matchSelector));
						}, this);
					}
				}, this);
			}
		});
	};

	plugins.matches.enabled = true;
})(require('../plugins'));
