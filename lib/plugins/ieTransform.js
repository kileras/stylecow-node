//Some code has been taken from https://github.com/pbakaus/transformie (thanks so much, guys!!)

require('sylvester');

var toRadian = function (value) {
	if (value.indexOf('deg') !== -1) {
		return parseFloat(value, 10) * (Math.PI * 2 / 360);
	}

	if (value.indexOf('grad') !== -1) {
		return parseFloat(value, 10) * (Math.PI/200);
	}

	return parseFloat(value, 10);
};

var getMatrix = function (fnName, values) {
	var a;

	switch(fnName) {
		case 'matrix':
			return $M([
				[values[0], values[2], 0],
				[values[1], values[3], 0],
				[0, 0, 1]
			]);

		case 'rotate':
			a = toRadian(values[0]);

			return $M([
				[Math.cos(a), -Math.sin(a), 0],
				[Math.sin(a), Math.cos(a), 0],
				[0, 0, 1]
			]);

		case 'scale':
			return $M([
				[values[0], 0, 0],
				[0, values[0], 0],
				[0, 0, 1]
			]);

		case 'scaleX':
			return $M([
				[values[0], 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			]);

		case 'scaleY':
			return $M([
				[1, 0, 0],
				[0, values[0], 0],
				[0, 0, 1]
			]);

		case 'skew':
			a = toRadian(values[0]);

			return $M([
				[1, 0, 0],
				[Math.tan(a), 1, 0],
				[0, 0, 1]
			]);

		case 'skewX':
			a = toRadian(values[0]);

			return $M([
				[1, Math.tan(a), 0],
				[0, 1, 0],
				[0, 0, 1]
			]);

		case 'skewY':
			a = toRadian(values[0]);

			return $M([
				[1, 0, 0],
				[Math.tan(a), 1, 0],
				[0, 0, 1]
			]);
	}
};


module.exports = {
	beforeRuleFunctions: {
		rotate: function (fn, data) {
			if (!this.is('transform')) {
				return;
			}

			var value = fn.params[0];

			if (value.indexOf('deg') !== -1) {
				var deg = parseInt(value, 10), filter;

				if (deg < 0) {
					deg += 360;
				}

				switch (deg) {
					case 90:
						filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)';
						break;

					case 180:
						filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)';
						break;

					case 270:
						filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';
						break;

					case 360:
						filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=4)';
						break;
				}

				if (filter) {
					this.parent.addMsFilter(filter);
				} else {
					data.matrix = data.matrix || [];
					data.matrix.push(getMatrix('rotate', fn.params));
				}
			}
		},
		scaleX: function (fn, data) {
			if (!this.is('transform')) {
				return;
			}

			if (fn.params[0] == -1) {
				this.parent.addMsFilter('flipH');
			} else {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('scaleX', fn.params));
			}
		},
		scaleY: function (fn, data) {
			if (!this.is('transform')) {
				return;
			}

			if (fn.params[0] == -1) {
				this.parent.addMsFilter('flipV');
			} else {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('scaleY', fn.params));
			}
		},
		scale: function (fn, data) {
			if (!this.is('transform')) {
				return;
			}

			if (fn.params[0] == -1 && fn.params[1] == -1) {
				this.parent.addMsFilter('flipH, flipV');
			} else {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('scale', fn.params));
			}
		},
		matrix: function (fn, data) {
			if (this.is('transform')) {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('matrix', fn.params));
			}
		},
		skew: function (fn, data) {
			if (this.is('transform')) {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('skew', fn.params));
			}
		},
		skewX: function (fn, data) {
			if (this.is('transform')) {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('skewX', fn.params));
			}
		},
		skewY: function (fn, data) {
			if (this.is('transform')) {
				data.matrix = data.matrix || [];
				data.matrix.push(getMatrix('skewY', fn.params));
			}
		}
	},
	rule: function (data) {
		if (data.matrix) {
			var matrix = data.matrix[0];

			for (var k = 0; k < data.matrix.length; k++) {
				if (data.matrix[k+1]) {
					matrix = matrix.x(data.matrix[k+1]);
				}
			}

			this.parent.addMsFilter('progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = ' + matrix.elements[0][0] + ', M12 = ' + matrix.elements[0][1] + ', M21 = ' + matrix.elements[1][0] + ', M22 = ' + matrix.elements[1][1] + ')');
		}
	},
	enabled: true,
	description: 'Add ms filters to emulate some 2d transforms: rotate(), scale(), skew(), matrix(), etc',
	support: {
		'explorer': 9.0
	}
};
