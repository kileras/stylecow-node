var extractVariable = function (rule, variables) {
	if (rule.name.indexOf('var-') === 0) {
		variables[rule.name.substr(4)] = rule.value;

		rule.parent.remove(rule.index());
	}
};

module.exports = {
	init: function (variables) {
		this.getRulesets([':root', 'html']).forEach(function (ruleset) {
			ruleset.getRules().forEach(function (rule) {
				extractVariable(rule, variables);
			});
		});
	},

	rule: function (variables, settings, rootVariables) {
		if (this.name.indexOf('var-') === 0) {
			var selector = this.parent.selector;
			
			if (selector.is(':root') || selector.is('html')) {
				extractVariable(this, rootVariables);
			} else {
				extractVariable(this, variables);
			}
		}
	},

	functions: {
		var: function (fn, variables, settings, rootVariables) {
			return variables[fn.params[0]] || rootVariables[fn.params[0]] || fn.params[1];
		}
	},
	enabled: true,
	description: 'Add variables using standard var() function'
};
