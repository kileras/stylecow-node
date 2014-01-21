module.exports = {
	'comment': function () {
		if (!this.creator) {
			this.parent.remove(this.index());
		}
	},
	enabled: true,
	description: 'Removes all comments'
};
