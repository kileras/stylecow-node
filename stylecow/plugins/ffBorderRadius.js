var tree = require('../tree');

(function (plugins) {
	plugins.ffBorderRadius = function (css) {
		css.executeRecursive(function () {
			this.getRules().forEach(function (rule) {
				var newName;

				switch (rule.name) {
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

				rule.parent.addRule(new tree.rule(newName, rule.value), rule.index());
			});
		});
	};

	plugins.ffBorderRadius.support = {
		'firefox': 13.0
	};

	plugins.ffBorderRadius.enabled = true;
})(require('../plugins'));
