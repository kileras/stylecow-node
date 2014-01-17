var color = require('../color');

var executeFunction = function (fn) {
	if (!this.is(['background', 'background-color'])) {
		return;
	}

	var rgba = color.toRGBA(fn.string);

	if (rgba[3] === 1) {
		return '#' + color.RGBA_HEX(rgba);
	}

	var ahex = '#' + Math.round(255 * rgba[3]).toString(16) + color.RGBA_HEX(rgba);

	this.parent.addMsFilter('progid:DXImageTransform.Microsoft.gradient(startColorStr=\'' + ahex + '\', endColorStr=\'' + ahex + '\')');
};

module.exports = {
	functions: {
		rgba: executeFunction,
		hsla: executeFunction
	},
	enabled: true,
	support: {
		'explorer': 9.0
	}
};
