module.exports = {
	'comment': function () {
		if (!this.important) {
			this.parent.remove(this.index());
		}
	},
	enabled: true,
	description: 'Removes all comments'
};
