var extractVariable = function (rule, variables) {
	if (rule.name.indexOf('var-') === 0) {
		variables[rule.name.substr(4)] = rule.value;

		rule.parent.removeRule(rule.index());
	}
};

module.exports = {
	rule: function (variables) {
		extractVariable(this, variables);
	},

	functions: {
		var: function (fn, variables) {
			return variables[fn.params[0]] || fn.params[1];
		}
	},
	enabled: true
};
