var fs = require('fs');
var url = require('url');
var path = require('path');

module.exports = {
	'import': function () {
		var parser = require('../parser'),
			base = url.parse(this.getInherit('sourceFile'));

		if (base.hostname || (this.url[0] === '/')) {
			//console.error('Cannot resolve absolute links');
			return;
		}

		var file = url.resolve(base.pathname, this.url),
			css = parser.parseRuleset(fs.readFileSync(file, 'utf8')),
			index = this.index(),
			relativePath = path.dirname(file) + '/';

		while (css.children.length) {
			var child = css.children.pop();
			child.setSourceFile(file);
			child.importedFrom = relativePath;
			this.parent.add(child, index, true);
		}

		this.parent.remove(index);
	},
	functions: {
		url: function (fn) {
			if (this.parent.importedFrom) {
				var newUrl = path.normalize(this.parent.importedFrom + fn.params[0].replace(/['"]/g, ''));

				return "url('" + newUrl + "')";
			}
		}
	},
	enabled: true,
	description: 'Includes the @import css files with relative paths'
};
