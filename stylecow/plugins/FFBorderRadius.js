var Property = require('../Property.js');

var apply = function (options) {
	this.executeRecursive(function () {
		this.getProperties().forEach(function (property) {
			var newName;

			switch (property.name) {
				case 'border-top-left-radius':
					newName = '-moz-border-radius-topleft';
					break;

				case 'border-top-right-radius':
					newName = '-moz-border-radius-topright';
					break;

				case 'border-bottom-left-radius':
					newName = '-moz-border-radius-bottomleft';
					break;

				case 'border-bottom-right-radius':
					newName = '-moz-border-radius-bottomright';
					break;

				default:
					return;
			}

			property.parent.addProperty(Property.create(newName, property.value), property.index()).vendor = 'moz';
		});
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};