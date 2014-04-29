module.exports = {
	'comment': function (data, settings) {
		if (!this.important || (settings.plugins.removeComments.important === 'true')) {
			this.parent.remove(this.index());
		}
	},
	enabled: true,
	description: 'Removes all comments'
};
