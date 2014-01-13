var Property = require('../Property.js');

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties('clip').pop();

		if (property) {
			var value = property.value.replace(/\s+/g, '').replace(/,/g, ' ');

			if (!this.hasProperty(['clip', '*clip'], value)) {
				this.addProperty(Property.create('*clip', value)).vendor = 'ms';
			}
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};