var tree = require('../tree');

(function (plugins) {
	plugins.ieMinHeight = function (css) {
		css.executeRecursive(function () {
			var rule = this.getRules('min-height').pop();

			if (rule && !this.hasRule(['_height', '*height', 'height'])) {
				this.addRule(new tree.rule('_height', rule.value)).vendor = 'ms';
			}
		});
	};

	plugins.ieMinHeight.support = {
		'explorer': 7.0
	};

	plugins.ieMinHeight.enabled = true;
})(require('../plugins'));
