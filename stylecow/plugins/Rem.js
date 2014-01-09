var Property = require('../Property.js');

var valueToPixels = function (value) {
	if (value[0] === '.') {
		value = '0' + value;
	}

	if (value.indexOf('px') !== -1) {
		return parseInt(value, 10);
	}

	if (value.indexOf('em') !== -1) {
		return parseFloat(value, 10) * 16;
	}

	if (value.indexOf('pt') !== -1) {
		return parseFloat(value, 10) * 14;
	}

	return 16;
}

var remToPixels = function (value, rootPixels) {
	if (value[0] === '.') {
		value = '0' + value;
	}

	return (rootPixels * parseFloat(value, 10)) + 'px';
}

var apply = function (options) {
	var rem = 16;

	this.getChildren([':root', 'html', 'body']).forEach(function (child) {
		child.getProperties('font-size').forEach(function (property) {
			rem = valueToPixels(property.value);
		});
	});

	this.executeRecursive(function () {
		var newProperties = [];

		this.properties.forEach(function (property) {
			if (!property.value || property.value.indexOf('rem') === -1) {
				return false;
			}

			var value = property.value.replace(/([0-9\.]+)rem/, function (match) {
				return remToPixels(match, rem);
			});

			if (property.value !== value) {
				newProperties.push({
					prop: Property.create(property.name, value),
					index: property.index()
				});
			}
		}, this);

		newProperties.forEach(function (property) {
			this.addProperty(property.prop, property.index);
		}, this);
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	},
	valueToPixels: valueToPixels,
	remToPixels: remToPixels
};