var tree = require('./tree');
var utils = require('./utils');

var parser = {
	parseSelector: function (string) {
		string = string.trim();

		var type = string.match(/^(@[^\s]+)/);

		return new tree.selector(type ? type[1] : null, utils.explodeTrim(',', string));
	},
	parseRule: function (string) {
		var pieces = utils.explodeTrim(':', string, 2);

		return new tree.rule(pieces[0], pieces[1]);
	},
	parseImport: function (string) {
		var matches = string.trim().match(/^\@import (url\()?['"]?([^'"\)]+)/);

		return new tree.import(matches[2]);
	},
	parseComment: function (string) {
		return new tree.comment(string);
	},
	parseRuleset: function (code) {
		var ruleset = new tree.ruleset(),
			child = ruleset,
			status = ['selector'],
			buffer = '';

		code = code.split('\n');
		code.unshift('');

		for (var line = 0, totalLines = code.length; line < totalLines; line++) {
			var stringLine = code[line];
			
			if (status[0] !== 'comment') {
				stringLine = stringLine.trim();
			} else {
				stringLine += '\n';
			}

			if (!stringLine) {
				continue;
			}

			var col = 0,
				length = stringLine.length,
				currChar = null,
				previousChar = null,
				nextChar = stringLine[col];

			while (col < length) {
				previousChar = currChar;
				currChar = nextChar;
				col ++;
				nextChar = (col === length) ? null : stringLine[col];

				buffer += currChar;

				switch (currChar) {
					case '"':
						switch (status[0]) {
							case 'simpleQuote':
							case 'comment':
								break;

							case 'doubleQuote':
								if (previousChar !== '\\') {
									status.shift();
								}
								break;

							default:
								status.unshift('doubleQuote');
								break
						}
						break;

					case "'":
						switch (status[0]) {
							case 'doubleQuote':
							case 'comment':
								break;

							case 'simpleQuote':
								if (previousChar !== '\\') {
									status.shift();
								}
								break;

							default:
								status.unshift('simpleQuote');
								break
						}
						break;

					case '(':
						switch (status[0]) {
							case 'simpleQuote':
							case 'doubleQuote':
							case 'comment':
								break;

							default:
								status.unshift('parenthesis')
						}
						break;

					case ')':
						switch (status[0]) {
							case 'parenthesis':
								status.shift();
								break;
						}
						break;

					case '{':
						switch (status[0]) {
							case 'selector':
							case 'rules':
								child = child.add(new tree.ruleset(parser.parseSelector(buffer.slice(0, -1))));
								child.setSourceColLine(col, line);
								status.unshift('rules');
								buffer = '';
								break;
						}
						break;

					case '}':
						switch (status[0]) {
							case 'rules':
								buffer = buffer.slice(0, -1);
								if (buffer.trim()) {
									child.add(parser.parseRule(buffer.trim()));
								}
								buffer = '';
								status.shift();
								child = child.parent;
								break;
						}
						break;

					case ';':
						switch (status[0]) {
							case 'selector':
								if (buffer.indexOf('@import') !== -1) {
									child.add(parser.parseImport(buffer.slice(0, -1))).setSourceColLine(col, line);
								} else {
									child.add(new tree.ruleset(parser.parseSelector(buffer.slice(0, -1)))).setSourceColLine(col, line);
								}
								buffer = '';
								break;

							case 'rules':
								child.add(parser.parseRule(buffer.slice(0, -1)));
								buffer = '';
								break;
						}
						break;

					case '/':
						if (status[0] !== 'comment') {
							if (nextChar === '*') {
								status.unshift('comment');
								col++;
								
								var nextNextChar = (col === length) ? null : stringLine[col];
								
								if (nextNextChar === '/') {
									col++;
								}
							}
						} else if (previousChar === '*') {
							child.add(parser.parseComment(buffer.slice(2, -2)));
							buffer = '';
							status.shift();
						}
						break;

					default:
						if (!status.length) {
							status = ['selector'];
						}
				}
			}
		};

		return ruleset;
	}
};

module.exports = parser;
