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
	parseRuleset: function (code) {
		var ruleset = new tree.ruleset(),
			child = ruleset,
			status = ['selector'],
			buffer = '';

		code = code.split('\n');
		code.unshift('');

		for (var line = 0, totalLines = code.length; line < totalLines; line++) {
			var stringLine = code[line].trim();

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

				switch (currChar) {
					case '"':
						switch (status[0]) {
							case 'doubleQuote':
								buffer += currChar;

								if (previousChar !== '\\') {
									status.shift();
								}
								break;

							case 'simpleQuote':
								buffer += currChar;
								break;

							case 'selector':
							case 'rules':
								buffer += currChar;
								status.unshift('doubleQuote');
								break
						}
						break;

					case "'":
						switch (status[0]) {
							case 'simpleQuote':
								buffer += currChar;

								if (previousChar !== '\\') {
									status.shift();
								}
								break;

							case 'doubleQuote':
								buffer += currChar;
								break;

							case 'selector':
							case 'rules':
								buffer += currChar;
								status.unshift('simpleQuote');
								break
						}
						break;

					case '{':
						switch (status[0]) {
							case 'selector':
							case 'rules':
								child = child.addChild(new tree.ruleset(parser.parseSelector(buffer)));
								//->setSourceMap($line, $col, $relativePath);
								status.unshift('rules');
								buffer = '';
								break;
						}
						break;

					case '}':
						switch (status[0]) {
							case 'rules':
								if (buffer.trim()) {
									child.addRule(new tree.rule(parser.parseRule(buffer)));
									//->setSourceMap($line, $col, $relativePath);
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
								child.addChild(new tree.ruleset(parser.parseSelector(buffer)));
								//->setSourceMap($line, $col, $relativePath);

								/*if ((strpos($buffer, '@import') === false) || !is_object($Children = self::parseImport($buffer, $filename, $contextFile))) {
									$Child->addChild(new Css(Selector::createFromString($buffer)))->setSourceMap($line, $col, $relativePath);
								} else {
									foreach ($Children->getChildren() as $Each) {
										$Child->addChild($Each);
									}
								}*/

								buffer = '';
								break;

							case 'rules':
								child.addRule(parser.parseRule(buffer));
								//->setSourceMap($line, $col, $relativePath);
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
							} else {
								buffer += currChar;
							}
						} else if (previousChar === '*') {
							status.shift();
						}
						break;

					default:
						if (!status.length) {
							status = ['selector'];
						}
						
						if (status[0] !== 'comment') {
							buffer += currChar;
						}
				}

			}
		};

		return ruleset;
	}
};

module.exports = parser;
