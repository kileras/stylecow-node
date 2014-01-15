var tree = require('../tree');

(function (plugins) {
	plugins.ieInlineBlock = function (css) {
		css.executeRecursive(function () {
			var rule = this.getRules('display', 'inline-block').pop();

			if (rule) {
				if (!this.hasRule(['zoom', '*zoom'])) {
					this.addRule(new tree.rule('*zoom', '1')).vendor = 'ms';
				}
				if (!this.hasRule('*display')) {
					this.addRule(new tree.rule('*display', 'inline'));
				}

				//It's not necessary but cleaner
				if ((rule = this.getRules('_display').pop())) {
					this.removeRule(rule.index());
				}
			}
		});
	};

	plugins.ieInlineBlock.support = {
		'explorer': 8.0
	};

	plugins.ieInlineBlock.enabled = true;
})(require('../plugins'));
