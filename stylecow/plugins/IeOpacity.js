var Property = require('../Property.js');

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties('opacity').pop();

		if (property) {
			this.addMsFilterProperty('alpha(opacity=' + (parseFloat(property.value, 10) * 100) + ')');
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};