var color = require('../color');

var getFilter = function (rgba) {
	var ahex = '#' + Math.round(255 * rgba[3]).toString(16) + color.RGBA_HEX(rgba);

	return 'progid:DXImageTransform.Microsoft.gradient(startColorStr=\'' + ahex + '\', endColorStr=\'' + ahex + '\')';
};

(function (plugins) {
	plugins.ieBackgroundAlpha = function (css) {
		css.executeRecursive(function () {
			var rule = this.getRules(['background', 'background-color']).pop();

			if (rule) {
				rule.executeFunctions(function (name, params, fnString) {
					var rgba = color.toRGBA(fnString);

					if (rgba[3] === 1) {
						return '#' + color.RGBA_HEX(rgba);
					}

					this.parent.addMsFilter(getFilter(rgba));
				}, 'rgba');

				rule.executeFunctions(function (name, params, fnString) {
					var rgba = color.toRGBA(fnString);

					if (rgba[3] === 1) {
						return '#' + color.RGBA_HEX(rgba);
					}

					this.parent.addMsFilter(getFilter(rgba));
				}, 'hsla');
			}
		});
	};

	plugins.ieBackgroundAlpha.support = {
		'explorer': 9.0
	};

	plugins.ieBackgroundAlpha.enabled = true;
})(require('../plugins'));
