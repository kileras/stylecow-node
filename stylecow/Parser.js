var fs = require('fs'),
	Css = require('./Css.js'),
	Property = require('./Property.js'),
	Selector = require('./Selector.js');

var Parser = {
	parseFile: function (file) {
		var code = fs.readFileSync(file, 'utf8');

		return Parser.parse(code);
	},
	parse: function (code) {
		var css = Css.create(),
			child = css,
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
				thisChar = null,
				previousChar = null,
				nextChar = stringLine[col];

			while (col < length) {
				previousChar = thisChar;
				thisChar = nextChar;
				col ++;
				nextChar = (col === length) ? null : stringLine[col];

				switch (thisChar) {
					case '"':
						switch (status[0]) {
							case 'doubleQuote':
								buffer += thisChar;

								if (previousChar !== '\\') {
									status.shift();
								}
								break;

							case 'simpleQuote':
								buffer += thisChar;
								break;

							case 'selector':
							case 'properties':
								buffer += thisChar;
								status.unshift('doubleQuote');
								break
						}
						break;

					case "'":
						switch (status[0]) {
							case 'simpleQuote':
								buffer += thisChar;

								if (previousChar !== '\\') {
									status.shift();
								}
								break;

							case 'doubleQuote':
								buffer += thisChar;
								break;

							case 'selector':
							case 'properties':
								buffer += thisChar;
								status.unshift('simpleQuote');
								break
						}
						break;

					case '{':
						switch (status[0]) {
							case 'selector':
							case 'properties':
								child = child.addChild(Css.create(Selector.createFromString(buffer)));
								//->setSourceMap($line, $col, $relativePath);
								status.unshift('properties');
								buffer = '';
								break;
						}
						break;

					case '}':
						switch (status[0]) {
							case 'properties':
								if (buffer.trim()) {
									child.addProperty(Property.createFromString(buffer));
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
								child.addChild(new Css.create(Selector.createFromString(buffer)));
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

							case 'properties':
								child.addProperty(Property.createFromString(buffer));
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
								buffer += thisChar;
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
							buffer += thisChar;
						}
				}

			}
		};

		return css;
	}
};



module.exports = {
	parseFile: Parser.parseFile
};
