var tree = require('../tree');

module.exports = {
	rule: function () {
		if ((this.value === 'fill-available') && /^(min-|max-)?(width|height)$/.test(this.name)) {
			this.parent.add(new tree.rule(this.name, '-moz-available'), this.index());
		}
	},
	enabled: true,
	description: 'Fix for firefox that supports the "-moz-available" property rather than "-moz-fill-available"'
};
