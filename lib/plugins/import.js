module.exports = {
	'import': function () {
		var fs = require('fs'),
			parser = require('../parser'),
			url = require('url'),
			base = url.parse(this.getInherit('sourceFile', true));

		if (base.hostname || (this.url[0] === '/')) {
			//console.error('Cannot resolve absolute links');
			return;
		}

		base = base.pathname.match(/(.*\/)?[^\/]+\.[\w]+$/)[1] || '';

		var file = url.resolve(base, this.url);
		var css = parser.parseRuleset(fs.readFileSync(file, 'utf8'));
		var index = this.index();

		while (css.children.length) {
			var child = css.children.pop();
			child.setSourceFile(file);
			this.parent.add(child, index, true);
		}

		this.parent.remove(index);
	},
	enabled: true,
	description: 'Includes the @import css files with relative paths'
};
