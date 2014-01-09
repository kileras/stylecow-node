
var apply = function (options) {
	var css = this;

	css.executeRecursive(function () {
		if (this.isRoot() || this.parent.selector.type || !this.parent.selector.selectors.length) {
			return;
		}

		var parentSelectors = this.parent.selector.selectors,
			selectors = this.selector.selectors,
			root = this.getRoot();
		
		this.selector.remove();

		for (var i = 0, total = selectors.length; i < total; i++) {
			var selector = (selectors[i][0] === '&') ? selectors[i].substr(1) : ' ' + selectors[i];

			for (var ii = 0, total2 = parentSelectors.length; ii < total2; ii++) {
				this.selector.add(parentSelectors[ii] + selector);
			}
		}

		root.addChild(this);
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};