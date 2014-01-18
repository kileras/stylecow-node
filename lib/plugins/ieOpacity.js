module.exports = {
	rule: function () {
		if (this.name === 'opacity') {
			this.parent.addMsFilter('alpha(opacity=' + (parseFloat(this.value, 10) * 100) + ')');
		}
	},
	enabled: true,
	description: 'Add opacity support for explorer using ms filter',
	support: {
		'explorer': 9.0
	}
};
