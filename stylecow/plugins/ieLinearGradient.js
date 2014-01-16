var color = require('../color');

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
		params[0] = color.RGBA_HEX(color.toRGBA(params[0]));
		params[1] = color.RGBA_HEX(color.toRGBA(params[1]));

		if (reverse) {
			params.reverse();
		}

		if (direction === 'horizontal') {
			return 'progid:DXImageTransform.Microsoft.gradient(startColorStr=\'#' + params[0] + '\', endColorStr=\'#' + params[1] + '\', GradientType=1)';
		}

		return 'progid:DXImageTransform.Microsoft.gradient(startColorStr=\'#' + params[0] + '\', endColorStr=\'#' + params[1] + '\')';
	}
};

module.exports = {
	functions: {
		"linear-gradient": function (fn) {
			if (this.is(['background', 'background-image'])) {
				var filter = getFilter(fn.params);

				if (filter) {
					this.parent.addMsFilter(filter);
				}
			}
		}
	},
	enabled: true,
	support: {
		'explorer': 10.0
	}
};
