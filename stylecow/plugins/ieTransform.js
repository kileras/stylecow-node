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

(function (plugins) {
	plugins.ieTransform = function (css) {
		css.executeRecursive(function () {
			var rule = this.getRules('transform').pop(), that = this;

			if (!rule) {
				return;
			}

			rule.executeFunctions(function (name, params) {
				switch (name) {
					case 'rotate':
						that.addMsFilter(getRotateFilter(params[0]));
						break;

					case 'scaleX':
						if (params[0] == -1) {
							that.addMsFilter('flipH');
						}
						return;

					case 'scaleY':
						if (params[0] == -1) {
							that.addMsFilter('flipV');
						}
						return;

					case 'scale':
						if (params[0] == -1 && params[1] == -1) {
							that.addMsFilter('flipH, flipV');
						}
						return;
				}
			});
		});
	};

	plugins.ieTransform.support = {
		'explorer': 9.0
	};

	plugins.ieTransform.enabled = true;
})(require('../plugins'));
