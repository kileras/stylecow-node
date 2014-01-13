var Property = require('../Property.js'),
	Color = require('./Color.js');

var getFilter = function (color) {
	color = Color.toRGBA(color);
	color = '#' + Math.round(255 * color[3]).toString(16) + Color.RGBA_HEX(color);

	return 'progid:DXImageTransform.Microsoft.gradient(startColorStr=\'' + color + '\', endColorStr=\'' + color + '\')';
}

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties(['background', 'background-color']).pop();

		if (property) {
			property.executeFunctions(function (name, params, fnString) {
				this.parent.addMsFilterProperty(getFilter(fnString));
			}, 'rgba');

			property.executeFunctions(function (name, params, fnString) {
				this.parent.addMsFilterProperty(getFilter(fnString));
			}, 'hsla');
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};