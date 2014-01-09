var Property = require('../Property.js');

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties('min-height').pop();

		if (property && !this.hasProperty(['_height', '*height', 'height'])) {
			this.addProperty(Property.create('_height', property.value)).vendor = 'ms';
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};