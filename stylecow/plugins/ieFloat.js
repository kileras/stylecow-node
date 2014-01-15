var tree = require('../tree');

(function (plugins) {
	plugins.ieFloat = function (css) {
		css.executeRecursive(function () {
			if (this.hasRule('float', ['right', 'left']) && !this.hasRule(['display', '_display', '*display'], 'inline')) {
				this.addRule(new tree.rule('_display', 'inline')).vendor = 'ms';
			}
		});
	};

	plugins.ieFloat.support = {
		'explorer': 7.0
	};

	plugins.ieFloat.enabled = true;
})(require('../plugins'));
