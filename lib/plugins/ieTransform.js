var getRotateFilter = function (value) {
	value = parseInt(value, 10);

	if (value < 0) {
		value += 360;
	}

	switch (value) {
		case 90:
			return 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)';

		case 180:
			return 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)';

		case 270:
			return 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';

		case 360:
			return 'progid:DXImageTransform.Microsoft.BasicImage(rotation=4)';

		default:
			var rad = (value * Math.PI * 2) / 360;
			cos = Math.cos(rad);
			sin = Math.sin(rad);

			return 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = ' + cos + ', M12 = ' + (-sin) + ', M21 = ' + sin + ', M22 = ' + cos + ')';
	}
};

module.exports = {
	functions: {
		rotate: function (fn) {
			if (this.is('transform')) {
				this.parent.addMsFilter(getRotateFilter(fn.params[0]));
			}
		},
		scaleX: function (fn) {
			if (this.is('transform') && fn.params[0] == -1) {
				this.parent.addMsFilter('flipH');
			}
		},
		scaleY: function (fn) {
			if (this.is('transform') && fn.params[0] == -1) {
				this.parent.addMsFilter('flipV');
			}
		},
		scale: function (fn) {
			if (this.is('transform') && fn.params[0] == -1 && fn.params[1] == -1) {
				this.parent.addMsFilter('flipH, flipV');
			}
		}
	},
	enabled: true,
	support: {
		'explorer': 9.0
	}
};
