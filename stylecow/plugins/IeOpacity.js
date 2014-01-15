(function (plugins) {
	plugins.ieOpacity = function (css) {
		css.executeRecursive(function () {
			var rule = this.getRules('opacity').pop();

			if (rule) {
				this.addMsFilter('alpha(opacity=' + (parseFloat(rule.value, 10) * 100) + ')');
			}
		});
	};

	plugins.ieOpacity.support = {
		'explorer': 9.0
	};

	plugins.ieOpacity.enabled = true;
})(require('../plugins'));
