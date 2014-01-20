module.exports = {
	'comment': function () {
		this.parent.remove(this.index());
	},
	enabled: true,
	description: 'Removes all comments'
};
