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
}


var apply = function (options) {
	this.executeRecursive(function () {
		var property = this.getProperties('transform').pop();

		if (!property) {
			return;
		}

		var that = this;

		property.executeFunctions(function (name, params) {
			switch (name) {
				case 'rotate':
					that.addMsFilterProperty(getRotateFilter(params[0]));
					break;

				case 'scaleX':
					if (params[0] == -1) {
						that.addMsFilterProperty('flipH');
					}
					return;

				case 'scaleY':
					if (params[0] == -1) {
						that.addMsFilterProperty('flipV');
					}
					return;

				case 'scale':
					if (params[0] == -1 && params[1] == -1) {
						that.addMsFilterProperty('flipH, flipV');
					}
					return;
			}
		});
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};