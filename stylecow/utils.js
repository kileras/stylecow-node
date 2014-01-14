var Utils = {
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
			exploded = Utils.explode(delimiter, string, limit, strs_in, strs_out);

		for (var i = 0, total = exploded.length; i < total; i++) {
			var text_value = exploded[i].trim();
			
			if (text_value !== '') {
				array.push(text_value);
			}
		}

		return array;
	},
	executeFunctions: function (string, functionName, callback, thisCallback) {
		string = '' + string;

		if ((string.indexOf('(') === -1) || (functionName && string.indexOf(functionName + '(') === -1)) {
			return string;
		}

		var length = string.length,
			index = 0,
			regexp, matches, name;

		if (functionName) {
			regexp = new RegExp('(^|[^\w-])(' + functionName + ')$');
		} else {
			regexp = /([\w-]+)$/;
		}

		while (index < length) {
			index = string.indexOf('(', index);

			if (index === -1) {
				break;
			}

			if (functionName) {
				matches = string.substr(0, index).match(regexp);
				
				if (!matches) {
					index++;
					continue;
				}
				name = matches[2];
			} else {
				matches = string.substr(0, index).match(regexp);
				name = matches[0];
			}

			var start = index - name.length;

			for (var end = index, deep = 0; end <= length; end++) {
				var l = string[end] || '';

				if (l === '(') {
					deep++;
					continue;
				}

				if (l === ')' && deep) {
					deep--;
					
					if (!deep) {
						end++;
						break;
					}
				}
			}

			var parameters = string.slice(index + 1, end - 1);
			var result = callback.call(thisCallback, name, Utils.explodeTrim(',', parameters), string.slice(start, end));

			if (result !== undefined) {
				string = string.slice(0, start) + result.substr(0, end - start) + result.slice(end - start) + string.slice(end);
				length = string.length;

				if (result.indexOf('(') === -1) {
					index = start + result.length;
				} else {
					index = start + result.indexOf('(');
				}
			}

			index++;
		}

		return string;
	},
	clone: function (obj) {
		if (!obj) {
			return obj;
		}

		if (obj instanceof Array) {
			var copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = obj[i];
			}
			return copy;
		}

		if (obj instanceof Object) {
			var copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) {
					copy[attr] = obj[attr];
				}
			}
			return copy;
		}

		return obj;
	}
};


module.exports = Utils;
