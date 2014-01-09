var Utils = {
	explode: function (delimiter, string, limit, strs_in, strs_out) {
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
	}
};



module.exports = {
	explode: Utils.explode,
	explodeTrim: Utils.explodeTrim
};
