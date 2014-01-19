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

	rule: function (variables) {
		extractVariable(this, variables);
	},

	functions: {
		var: function (fn, variables) {
			return variables[fn.params[0]] || fn.params[1];
		}
	},
	enabled: true,
	description: 'Add variables using standard var() function'
};
