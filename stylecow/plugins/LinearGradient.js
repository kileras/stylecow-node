var Property = require('../Property.js'),
	Utils = require('../Utils.js');

var getWebkitOldSyntax = function (params) {
	var point = 'top', start, end, radius;

	if (/(top|bottom|left|right|deg)/.test(params[0])) {
		point = params.shift();
	}

	switch (point) {
		case 'to bottom':
			start = 'left top';
			end = 'left bottom';
			break;

		case 'to top':
			start = 'left bottom';
			end = 'left top';
			break;

		case 'to right':
			start = 'left top';
			end = 'right top';
			break;

		case 'to left':
			start = 'right top';
			end = 'left top';
			break;

		default:
			if (/^\ddeg$/.test(point)) {
				radius = parseInt(point, 10);
			} else {
				start = 'left top';
				end = 'left bottom';
			}
	}

	var colors = [],
		tk = params.length - 1;

	params.forEach(function (param, k) {
		param = Utils.explodeTrim(' ', param);

		var color = param[0], stop = param[1], text;

		if (k === 0) {
			text = 'from';
		} else if (k === tk) {
			text = 'to';
		} else {
			text = 'color-stop';
		}

		if (stop) {
			colors.push(text + '(' + stop + ', ' + color + ')');
		} else {
			colors.push(text + '(' + color + ')');
		}
	});

	if (radius) {
		return '-webkit-gradient(linear, ' + radius + 'deg, ' + colors.join(', ') + ')';
	}

	return '-webkit-gradient(linear, ' + start + ', ' + end + ', '+ colors.join(', ') + ')';
}

var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties(['background', 'background-image']).pop();

		if (property) {
			var search, replace;

			property.executeFunctions(function (name, params, fnString) {
				switch (params[0]) {
					case 'to top':
						params[0] = 'bottom';
						break;

					case 'to bottom':
						params[0] = 'top';
						break;

					case 'to left':
						params[0] = 'right';
						break;

					case 'to right':
						params[0] = 'left';
						break;

					default:
						return;
				}

				search = fnString;
				replace = params;
			}, 'linear-gradient');

			if (search) {
				var index = property.index();

				this.addProperty(Property.create(property.name, property.value.replace(search, getWebkitOldSyntax(replace))), index).vendor = 'webkit';

				replace = replace.join(', ');
				this.addProperty(Property.create(property.name, property.value.replace(search, '-moz-linear-gradient(' + replace + ')')), index).vendor = 'moz';
				this.addProperty(Property.create(property.name, property.value.replace(search, '-webkit-linear-gradient(' + replace + ')')), index).vendor = 'webkit';
				this.addProperty(Property.create(property.name, property.value.replace(search, '-o-linear-gradient(' + replace + ')')), index).vendor = 'o';
			}
		}
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};
