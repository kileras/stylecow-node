var utils = {
	repeat: function (pattern, count) {
		var result = '';

		while (count > 0) {
			result += pattern;
			count--;
		}

		return result;
	},
	explode: function (delimiter, string, limit, strs_in, strs_out) {
		if (!string) {
			return [];
		}

		strs_in = strs_in || ['(', '"', "'"];
		strs_out = strs_out || [')', '"', "'"];

		var exists = false;

		for (var i = 0, total = strs_in.length; i < total; i++) {
			if (string.indexOf(strs_in[i]) !== -1) {
				exists = true;
				break;
			}
		}

		if (!exists) {
			return string.split(delimiter, limit);
		}

		var array = [],
			str_out = [],
			delimiter_length = delimiter.length;

		loop1:
		while (string) {
			if (limit && array.length === (limit - 1)) {
				array.push(string);
				break;
			}

			if (string.indexOf(delimiter) === -1) {
				array.push(string);
				break;
			}

			for (var n = 0, deep = 0, length = string.length; n <= length; n++) {
				var l = string[n] || '';

				if ((l === str_out[0]) && deep) {
					str_out.shift();
					deep--;
					continue;
				}

				var k = strs_in.indexOf(l);

				if (k !== -1) {
					str_out.unshift(strs_out[k]);
					deep++;
					continue;
				}

				if ((deep === 0) && (l === delimiter || n === length || l === str_out[0] || (delimiter_length > 1 && string.substr(n).indexOf(delimiter) === 0))) {
					array.push(string.substr(0, n).trim());
					string = string.substr(n + delimiter_length).trim();
					
					if (l === str_out[0]) {
						break;
					}

					continue loop1;
				}
			}

			break;
		}

		return array;
	},
	explodeTrim: function (delimiter, string, limit, strs_in, strs_out) {
		var array = [],
			exploded = utils.explode(delimiter, string, limit, strs_in, strs_out);

		for (var i = 0, total = exploded.length; i < total; i++) {
			var text_value = exploded[i].trim();
			
			if (text_value !== '') {
				array.push(text_value);
			}
		}

		return array;
	},
	getFunctionInfo: function (string) {
		var matches = string.match(/^([\w-]+)\((.*)\)$/);

		if (matches) {
			return {
				string: matches[0],
				name: matches[1],
				params: utils.explodeTrim(',', matches[2])
			};
		}
	},
	executeFunctions: function (string, callback, thisCallback) {
		string = '' + string;

		if (string.indexOf('(') === -1) {
			return string;
		}

		var index = string.length - 1,
			deep = 0,
			fns = [],
			quotes,
			currChar,
			currFn,
			result = '';

		while (index >= 0) {
			currChar = string[index];
			result = currChar + result;
			index--;

			if (quotes && quotes === currChar) {
				quotes = undefined;
			} else if (currChar === '"' || currChar === "'") {
				quotes = currChar;
			}

			fns.forEach(function (fn) {
				fn.str = currChar + fn.str;
			});

			if (!quotes && currChar === ')') {
				currFn = {
					str: currChar,
					name: false
				};

				fns.unshift(currFn);

				continue;
			}

			if (currFn) {
				if (currFn.name && (!/[\w-]/.test(currChar) || index === -1)) {
					var resultFn = callback.call(thisCallback, (index === -1 ? currFn.str : currFn.str.substr(1)));

					if (resultFn !== undefined) {
						if (index !== -1) {
							resultFn = currChar + resultFn;
						}

						result = resultFn + result.substr(currFn.str.length);

						var length = currFn.str.length;
						fns.shift();
						currFn = fns[0];

						fns.forEach(function (fn) {
							fn.str = resultFn + fn.str.substr(length);
						});
					} else {
						fns.shift();
						currFn = fns[0];
					}
				}

				if (!quotes && currChar === '(') {
					currFn.name = true;
				}
			}
		}

		return result;
	},
	clone: function (obj) {
		if (!obj) {
			return obj;
		}

		var copy, i;

		if (obj instanceof Array) {
			copy = [];

			for (i = 0, len = obj.length; i < len; i++) {
				copy[i] = obj[i];
			}

			return copy;
		}

		if (obj instanceof Object) {
			copy = {};

			for (i in obj) {
				if (obj.hasOwnProperty(i)) {
					copy[i] = obj[i];
				}
			}
			return copy;
		}

		return obj;
	},
	needSupport: function (browsers, featureSupport) {
		if (!featureSupport) {
			return true;
		}

		for (var browser in browsers) {
			if (!(browser in featureSupport)) {
				continue;
			}

			if (browsers[browser] < featureSupport[browser]) {
				return true;
			}
		}

		return false;
	}
};

module.exports = utils;
