var tree = require('../tree');

(function (plugins) {
	plugins.ieClip = function (css) {
		css.executeRecursive(function () {
			var rule = this.getRules('clip').pop();

			if (rule) {
				var value = rule.value.replace(/\s+/g, '').replace(/,/g, ' ');

				if (!this.hasRule(['clip', '*clip'], value)) {
					this.addRule(new tree.rule('*clip', value)).vendor = 'ms';
				}
			}
		});
	};

	plugins.ieClip.support = {
		'explorer': 8.0
	};

	plugins.ieClip.enabled = true;
})(require('../plugins'));
