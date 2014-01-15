(function (plugins) {
	plugins.variables = function (css) {
		var variables = {};

		css.getChildren([':root', 'html']).forEach(function (css) {
			css.rules.forEach(function (rule) {
				if (rule.name.indexOf('var-') === 0) {
					variables[rule.name.substr(4)] = rule.value;

					rule.parent.removeProperty(rule.index());
				}
			});
		});

		css.executeRecursive(function (variables) {
			this.rules.forEach(function (rule) {
				if (rule.name.indexOf('var-') === 0) {
					variables[rule.name.substr(4)] = rule.value;

					rule.parent.removeRule(rule.index());
				} else {
					rule.executeFunctions(function (name, params) {
						var variable = params[0];

						if (!variable || !variables[variable]) {
							return params[1];
						}

						return variables[variable];
					}, 'var');
				}
			});
		}, variables);
	};

	plugins.variables.enabled = true;
})(require('../plugins'));
