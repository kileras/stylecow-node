var Property = require('../Property.js'),
	Color = require('./Color.js');

var getFilter = function (params) {
	var direction, reverse;

	switch (params.shift()) {
		case 'to bottom':
		case '90deg':
			direction = 'vertical';
			reverse = false;
			break;

		case 'to top':
		case '-90deg':
			direction = 'vertical';
			reverse = true;
			break;

		case 'to right':
		case '180deg':
		case '-180deg':
			direction = 'horizontal';
			reverse = false;
			break;

		case 'to left':
		case '0deg':
		case '360deg':
			direction = 'vertical';
			reverse = true;
			break;

		default:
			return;
	}

	if (direction && params.length === 2) {
		params[0] = Color.RGBA_HEX(Color.toRGBA(params[0]));
		params[1] = Color.RGBA_HEX(Color.toRGBA(params[1]));

		if (reverse) {
			params.reverse();
		}

		if (direction === 'horizontal') {
			return 'progid:DXImageTransform.Microsoft.gradient(startColorStr=\'#' + params[0] + '\', endColorStr=\'#' + params[1] + '\', GradientType=1)';
		}

		return 'progid:DXImageTransform.Microsoft.gradient(startColorStr=\'#' + params[0] + '\', endColorStr=\'#' + params[1] + '\')';
	}
}

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties(['background', 'background-image']).pop();

		if (property) {
			property.executeFunctions(function (name, params, fnString) {
				var filter = getFilter(params);

				if (filter) {
					this.parent.addMsFilterProperty(filter);
				}
			}, 'linear-gradient');
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};