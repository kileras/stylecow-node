var utils = require('./utils');

var color = {
	names: {
		'aliceblue': '#F0F8FF',
		'antiquewhite': '#FAEBD7',
		'aqua': '#00FFFF',
		'aquamarine': '#7FFFD4',
		'azure': '#F0FFFF',
		'beige': '#F5F5DC',
		'bisque': '#FFE4C4',
		'black': '#000000',
		'blanchedalmond': '#FFEBCD',
		'blue': '#0000FF',
		'blueviolet': '#8A2BE2',
		'brown': '#A52A2A',
		'burlywood': '#DEB887',
		'cadetblue': '#5F9EA0',
		'chartreuse': '#7FFF00',
		'chocolate': '#D2691E',
		'coral': '#FF7F50',
		'cornflowerblue': '#6495ED',
		'cornsilk': '#FFF8DC',
		'crimson': '#DC143C',
		'cyan': '#00FFFF',
		'darkblue': '#00008B',
		'darkcyan': '#008B8B',
		'darkgoldenrod': '#B8860B',
		'darkgray': '#A9A9A9',
		'darkgrey': '#A9A9A9',
		'darkgreen': '#006400',
		'darkkhaki': '#BDB76B',
		'darkmagenta': '#8B008B',
		'darkolivegreen': '#556B2F',
		'darkorange': '#FF8C00',
		'darkorchid': '#9932CC',
		'darkred': '#8B0000',
		'darksalmon': '#E9967A',
		'darkseagreen': '#8FBC8F',
		'darkslateblue': '#483D8B',
		'darkslategray': '#2F4F4F',
		'darkslategrey': '#2F4F4F',
		'darkturquoise': '#00CED1',
		'darkviolet': '#9400D3',
		'deeppink': '#FF1493',
		'deepskyblue': '#00BFFF',
		'dimgray': '#696969',
		'dimgrey': '#696969',
		'dodgerblue': '#1E90FF',
		'firebrick': '#B22222',
		'floralwhite': '#FFFAF0',
		'forestgreen': '#228B22',
		'fuchsia': '#FF00FF',
		'gainsboro': '#DCDCDC',
		'ghostwhite': '#F8F8FF',
		'gold': '#FFD700',
		'goldenrod': '#DAA520',
		'gray': '#808080',
		'grey': '#808080',
		'green': '#008000',
		'greenyellow': '#ADFF2F',
		'honeydew': '#F0FFF0',
		'hotpink': '#FF69B4',
		'indianred ': '#CD5C5C',
		'indigo ': '#4B0082',
		'ivory': '#FFFFF0',
		'khaki': '#F0E68C',
		'lavender': '#E6E6FA',
		'lavenderblush': '#FFF0F5',
		'lawngreen': '#7CFC00',
		'lemonchiffon': '#FFFACD',
		'lightblue': '#ADD8E6',
		'lightcoral': '#F08080',
		'lightcyan': '#E0FFFF',
		'lightgoldenrodyellow': '#FAFAD2',
		'lightgray': '#D3D3D3',
		'lightgrey': '#D3D3D3',
		'lightgreen': '#90EE90',
		'lightpink': '#FFB6C1',
		'lightsalmon': '#FFA07A',
		'lightseagreen': '#20B2AA',
		'lightskyblue': '#87CEFA',
		'lightslategray': '#778899',
		'lightslategrey': '#778899',
		'lightsteelblue': '#B0C4DE',
		'lightyellow': '#FFFFE0',
		'lime': '#00FF00',
		'limegreen': '#32CD32',
		'linen': '#FAF0E6',
		'magenta': '#FF00FF',
		'maroon': '#800000',
		'mediumaquamarine': '#66CDAA',
		'mediumblue': '#0000CD',
		'mediumorchid': '#BA55D3',
		'mediumpurple': '#9370D8',
		'mediumseagreen': '#3CB371',
		'mediumslateblue': '#7B68EE',
		'mediumspringgreen': '#00FA9A',
		'mediumturquoise': '#48D1CC',
		'mediumvioletred': '#C71585',
		'midnightblue': '#191970',
		'mintcream': '#F5FFFA',
		'mistyrose': '#FFE4E1',
		'moccasin': '#FFE4B5',
		'navajowhite': '#FFDEAD',
		'navy': '#000080',
		'oldlace': '#FDF5E6',
		'olive': '#808000',
		'olivedrab': '#6B8E23',
		'orange': '#FFA500',
		'orangered': '#FF4500',
		'orchid': '#DA70D6',
		'palegoldenrod': '#EEE8AA',
		'palegreen': '#98FB98',
		'paleturquoise': '#AFEEEE',
		'palevioletred': '#D87093',
		'papayawhip': '#FFEFD5',
		'peachpuff': '#FFDAB9',
		'peru': '#CD853F',
		'pink': '#FFC0CB',
		'plum': '#DDA0DD',
		'powderblue': '#B0E0E6',
		'purple': '#800080',
		'red': '#FF0000',
		'rosybrown': '#BC8F8F',
		'royalblue': '#4169E1',
		'saddlebrown': '#8B4513',
		'salmon': '#FA8072',
		'sandybrown': '#F4A460',
		'seagreen': '#2E8B57',
		'seashell': '#FFF5EE',
		'sienna': '#A0522D',
		'silver': '#C0C0C0',
		'skyblue': '#87CEEB',
		'slateblue': '#6A5ACD',
		'slategray': '#708090',
		'slategrey': '#708090',
		'snow': '#FFFAFA',
		'springgreen': '#00FF7F',
		'steelblue': '#4682B4',
		'tan': '#D2B48C',
		'teal': '#008080',
		'thistle': '#D8BFD8',
		'tomato': '#FF6347',
		'turquoise': '#40E0D0',
		'violet': '#EE82EE',
		'wheat': '#F5DEB3',
		'white': '#FFFFFF',
		'whitesmoke': '#F5F5F5',
		'yellow': '#FFFF00',
		'yellowgreen': '#9ACD32'
	},

	HEX_RGBA: function (hex) {
		var r,g,b;

		if (hex.length === 3) {
			r = hex[0] + hex[0];
			g = hex[1] + hex[1];
			b = hex[2] + hex[2];
		} else {
			r = hex[0] + hex[1];
			g = hex[2] + hex[3];
			b = hex[4] + hex[5];
		}

		return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1];
	},

	RGBA_HEX: function (rgba) {
		var r = ((rgba[0] > 255) ? 255 : (rgba[0] < 0 ? 0 : rgba[0])).toString(16),
			g = ((rgba[1] > 255) ? 255 : (rgba[1] < 0 ? 0 : rgba[1])).toString(16),
			b = ((rgba[2] > 255) ? 255 : (rgba[2] < 0 ? 0 : rgba[2])).toString(16);

		if (r.length === 1) {
			r = '0' + r;
		}
		if (g.length === 1) {
			g = '0' + g;
		}
		if (b.length === 1) {
			b = '0' + b;
		}

		return (r + g + b).toUpperCase();
	},

	RGBA_HSLA: function (rgba) {
		var r = rgba[0] / 255,
			g = rgba[1] / 255,
			b = rgba[2] / 255,
			a = rgba[3],
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			l = (max + min) / 2,
			h,
			s;

		if (delta === 0) {
			h = 0;
			s = 0;
		} else {
			if (l < 0.5) {
				s = delta / (max + min);
			} else {
				s = delta / (2 - max - min);
			}

			var delta_r = (((max - r) / 6) + (delta / 2)) / delta;
			var delta_g = (((max - g) / 6) + (delta / 2)) / delta;
			var delta_b = (((max - b) / 6) + (delta / 2)) / delta;

			if (r === max) {
				h = delta_b - delta_g;
			} else if (g === max) {
				h = (1 / 3) + delta_r - delta_b;
			} else if (b === max) {
				h = (2 / 3) + delta_g - delta_r;
			}

			if (h < 0) {
				h += 1;
			}

			if (h > 1) {
				h -= 1;
			}
		}

		return [Math.round(h * 360), (s.toFixed(2) * 100), (l.toFixed(2) * 100), a];
	},

	HSLA_RGBA: function (hsla) {
		var h = hsla[0],
			s = hsla[1]/100,
			l = hsla[2]/100,
			a = hsla[3],
			r,
			g,
			b;

		if (h > 0) {
			h /= 360;
		}

		if (s === 0) {
			r = l;
			g = l;
			b = l;
		} else {
			var t1, t2, rt3, gt3, bt3;

			if (l < 0.5) {
				t2 = l * (1.0 + s);
			} else {
				t2 = (l + s) - (l * s);
			}

			t1 = 2.0 * l - t2;

			rt3 = h + 1.0/3.0;
			gt3 = h;
			bt3 = h - 1.0/3.0;

			if (rt3 < 0) {
				rt3 += 1.0;
			}
			if (rt3 > 1) {
				rt3 -= 1.0;
			}
			if (gt3 < 0) {
				gt3 += 1.0;
			}
			if (gt3 > 1) {
				gt3 -= 1.0;
			}
			if (bt3 < 0) {
				bt3 += 1.0;
			}
			if (bt3 > 1) {
				bt3 -= 1.0;
			}

			if (6.0 * rt3 < 1) {
				r = t1 + (t2 - t1) * 6.0 * rt3;
			} else if (2.0 * rt3 < 1) {
				r = t2;
			} else if (3.0 * rt3 < 2) {
				r = t1 + (t2 - t1) * ((2.0/3.0) - rt3) * 6.0;
			} else {
				r = t1;
			}

			if (6.0 * gt3 < 1) {
				g = t1 + (t2 - t1) * 6.0 * gt3;
			} else if (2.0 * gt3 < 1) {
				g = t2;
			} else if (3.0 * gt3 < 2) {
				g = t1 + (t2 - t1) * ((2.0/3.0) - gt3) * 6.0;
			} else {
				g = t1;
			}

			if (6.0 * bt3 < 1) {
				b = t1 + (t2 - t1) * 6.0 * bt3;
			} else if (2.0 * bt3 < 1) {
				b = t2;
			} else if (3.0 * bt3 < 2) {
				b = t1 + (t2 - t1) * ((2.0/3.0) - bt3) * 6.0;
			} else {
				b = t1;
			}
		}

		r = Math.round(255 * r);
		g = Math.round(255 * g);
		b = Math.round(255 * b);

		return [r, g, b, a];
	},

	toRGBA: function (string) {
		if (string[0] === '#') {
			return color.HEX_RGBA(string.substr(1));
		}
		if (string.toLowerCase() === 'transparent') {
			return [0, 0, 0, 0];
		}
		if (color.names[string.toLowerCase()]) {
			return color.HEX_RGBA(color.names[string.toLowerCase()].substr(1));
		}

		var matches;

		if (matches = string.match(/rgb\((\d+)[,\s]+(\d+)[,\s]+(\d+)\)/)) {
			return [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), 1];
		}
		if (matches = string.match(/rgba\((\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+([\d\.]+)\)/)) {
			return [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseFloat(matches[4])];
		}
		if (matches = string.match(/hsl\((\d+)[,\s]+(\d+)[,\s]+(\d+)\)/)) {
			return color.HSLA_RGBA([parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), 1]);
		}
		if (matches = string.match(/hsla\((\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+([\d\.]+)\)/)) {
			return color.HSLA_RGBA([parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseFloat(matches[4])]);
		}

		return [0, 0, 0, 1];
	},

	mix: function (string) {
		var colors = utils.explodeTrim(' ', string);

		if (colors.length === 1) {
			return color.toRGBA(colors[0]);
		}

		var sumColors = [0, 0, 0, 0],
			total = colors.length;

		colors.forEach(function (rgba) {
			rgba = color.toRGBA(rgba);

			sumColors[0] += rgba[0];
			sumColors[1] += rgba[1];
			sumColors[2] += rgba[2];
			sumColors[3] += rgba[3];
		});

		sumColors[0] = Math.round(sumColors[0]/total);
		sumColors[1] = Math.round(sumColors[1]/total);
		sumColors[2] = Math.round(sumColors[2]/total);
		sumColors[3] = Math.round(sumColors[3]/total);

		return sumColors;
	}
};

module.exports = color;
