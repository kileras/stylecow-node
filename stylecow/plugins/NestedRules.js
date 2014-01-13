
var apply = function (options) {
	this.executeRecursive(function (data, index) {
		if (this.isRoot() || this.parent.selector.type || !this.parent.selector.selectors.length) {
			return;
		}

		var parentSelectors = this.parent.selector.selectors,
			selectors = this.selector.selectors,
			root = this.getRoot();
		
		this.selector.remove();

		selectors.forEach(function (selector) {
			selector = (selector[0] === '&') ? selector.substr(1) : ' ' + selector;

			parentSelectors.forEach(function (parentSelector) {
				this.selector.add(parentSelector + selector);
			}, this);
		}, this);
console.log(index);
//console.log(root.index());
		//root.parent.addChild(this);
		root.parent.addChild(this, root.index() + index, true);
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};