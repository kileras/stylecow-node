var utils = require('../utils');
var tree = require('../tree');

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

	var colors = [], tk = params.length - 1;

	params.forEach(function (param, k) {
		param = utils.explodeTrim(' ', param);

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
};

module.exports = {
	functions: {
		'linear-gradient': function (fn) {
			if (!this.is(['background', 'background-image'])) {
				return;
			}

			var params = utils.clone(fn.params);

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

			var index = this.index();
			var replace = params.join(', ');

			this.parent.addRule(new tree.rule(this.name, this.value.replace(fn.string, getWebkitOldSyntax(params))), index).vendor = 'webkit';
			this.parent.addRule(new tree.rule(this.name, this.value.replace(fn.string, '-moz-linear-gradient(' + replace + ')')), index).vendor = 'moz';
			this.parent.addRule(new tree.rule(this.name, this.value.replace(fn.string, '-webkit-linear-gradient(' + replace + ')')), index).vendor = 'webkit';
			this.parent.addRule(new tree.rule(this.name, this.value.replace(fn.string, '-o-linear-gradient(' + replace + ')')), index).vendor = 'o';
		}
	},
	enabled: true,
	description: 'Fallback for browsers supporting the olders syntax of linear-gradient and -webkit-gradient',
	support: {
		'explorer': 10.0,
		'chrome': 26.0,
		'opera': 12.1,
		'safari': 6.1,
		'ios': 7.0,
		'android': 4.4
	}
};
