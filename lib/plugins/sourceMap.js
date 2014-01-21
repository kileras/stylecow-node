var tree = require('../tree');

module.exports = {
	'ruleset': function () {
		var comment = new tree.comment(this.getInherit('sourceFile', true) + ':' + this.sourceColLine[1]);
		comment.creator = 'sourceMap';

		this.parent.add(comment, this.index());
	},
	enabled: true,
	description: 'Add a comment with the original file/line of all rulesets before transform'
};
