var utils = require('../utils');
var color = require('../color');

var editTint = function (rgba, tint) {
	rgba[0] += Math.round(((255 - rgba[0]) * (100 - parseFloat(tint))) / 100);
	rgba[1] += Math.round(((255 - rgba[1]) * (100 - parseFloat(tint))) / 100);
	rgba[2] += Math.round(((255 - rgba[2]) * (100 - parseFloat(tint))) / 100);

	return rgba;
}

var editChannel = function (color, channel, value) {
	var channels = {
		'hue': [0, 255],
		'saturation': [1, 100],
		'light': [2, 100],
		'red': [0, 255],
		'green': [1, 255],
		'blue': [2, 255],
		'alpha': [3, 1]
	};

	if (!(channel = channels[channel])) {
		return color;
	}

	if (value[0] === '+' || value[0] === '-') {
		value = parseFloat(color[channel[0]]) + parseFloat(value);
	}

	if (value > channel[1]) {
		value = channel[1];
	} else if (value < 0) {
		value = 0;
	}

	color[channel[0]] = value;

	return color;
}


(function (plugins) {
	plugins.color = function (css) {
		css.executeRecursive(function () {
			this.rules.forEach(function (rule) {
				rule.executeFunctions(function (name, parameters) {
					var rgba = color.mix(parameters.shift());

					parameters.forEach(function (operation) {
						var name, value;

						if (operation.indexOf(':') === -1) {
							if (/^[\+\-]?[0-9]+$/.test(operation)) {
								name = 'tint';
								value = operation;
							} else if (/^[\+\-]?[0-9\.]+$/.test(operation)) {
								name = 'alpha';
								value = operation;
							} else {
								return;
							}
						} else {
							var e = utils.explodeTrim(':', operation, 2);
							name = e[0];
							value = e[1];
						}

						switch (name) {
							case 'hue':
							case 'saturation':
							case 'light':
								rgba = color.HSLA_RGBA(editChannel(color.RGBA_HSLA(rgba), name, value));
								break;
							
							case 'red':
							case 'green':
							case 'blue':
							case 'alpha':
								rgba = editChannel(rgba, name, value);
								break;
							
							case 'tint':
								rgba = editTint(rgba, value);
								break;
						}
					});

					if (rgba[3] < 1) {
						return 'rgba(' + rgba.join(', ') + ')';
					}

					return '#' + color.RGBA_HEX(rgba);
				}, 'color');
			});
		});

		plugins.color.enabled = true;
	};
})(require('../plugins'));
