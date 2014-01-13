var apply = function (options) {
	var variables = {};

	this.getChildren([':root', 'html']).forEach(function (css) {
		css.properties.forEach(function (property, index) {
			if (property.name.indexOf('var-') === 0) {
				variables[property.name.substr(4)] = property.value;

				property.parent.removeProperty(index);
			}
		});
	});

	this.executeRecursive(function (variables) {
		this.properties.forEach(function (property, index) {
			if (property.name.indexOf('var-') === 0) {
				variables[property.name.substr(4)] = property.value;

				property.parent.removeProperty(index);
			} else {
				property.executeFunctions(function (name, params) {
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

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};