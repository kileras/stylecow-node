var Property = require('../Property.js');

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties('display', 'inline-block').pop();

		if (property) {
			if (!this.hasProperty(['zoom', '*zoom'])) {
				this.addProperty(Property.create('*zoom', 1)).vendor = 'ms';
			}
			if (!this.hasProperty('*display')) {
				this.addProperty(Property.create('*display', 'inline'));
			}

			//It's not necessary but cleaner
			if ((property = this.getProperties('_display').pop())) {
				this.removeProperty(property.index());
			}
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};