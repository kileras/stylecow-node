var Property = require('../Property.js');

var apply = function (options) {
	this.executeRecursive(function () {
		if (this.hasProperty('float', ['right', 'left']) && !this.hasProperty(['display', '_display', '*display'], 'inline')) {
			this.addProperty(Property.create('_display', 'inline')).vendor = 'ms';
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};