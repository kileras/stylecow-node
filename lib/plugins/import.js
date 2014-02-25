var fs = require('fs');
var url = require('url');
var path = require('path');

module.exports = {
	'import': function (data, settings, rootData) {
		var parser = require('../parser'),
			base = url.parse(this.url);

		if (base.hostname || (this.url[0] === '/')) {
			return;
		}

		var file = url.resolve(base.pathname, this.url),
			css = parser.parseRuleset(fs.readFileSync(file, 'utf8')),
			index = this.index(),
			relativePath = path.dirname(this.url) + '/';

		var info = this.getInherit('info');

		if (info.files.indexOf(file) !== -1) {
			console.error(file + ' has been imported');
			return;
		}

		info.files.push(file);

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

				var newUrl = this.parent.importedFrom + fn.params[0].replace(/['"]/g, '');

				return "url('" + newUrl + "')";
			}
		}
	},
	enabled: true,
	description: 'Includes the @import css files with relative paths'
};
