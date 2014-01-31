var utils = require('../utils');

module.exports = {
	selector: function () {
		if (this.toString().indexOf(':fullscreen') !== -1) {
			var ruleset = this.parent;
			var index = ruleset.index();
			var moz_clone = ruleset.clone();
			var webkit_clone = ruleset.clone();

			this.selectors.forEach(function (selector, key) {
				moz_clone.selector.selectors[key] = selector.replace(':fullscreen', ':-moz-full-screen');
				webkit_clone.selector.selectors[key] = selector.replace(':fullscreen', ':-webkit-full-screen');
			});

			ruleset.parent.add(moz_clone, index).vendor = 'moz';
			ruleset.parent.add(webkit_clone, index).vendor = 'webkit';
		}
	},
	enabled: true,
	description: 'Fix Webkit/mozilla browsers that supports :-moz-full-screen and :-webkit-full-screen instead :-moz-fullscreen and :-webkit-fullscreen'
};
