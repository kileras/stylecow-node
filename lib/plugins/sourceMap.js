var tree = require('../tree');

module.exports = {
	'ruleset': function () {
		var comment = new tree.comment(this.getInherit('sourceFile') + ':' + this.sourceColLine[1], true);

		this.parent.add(comment, this.index());
	},
	enabled: false,
	description: 'Add a comment with the original file/line of all rulesets before transform'
};
