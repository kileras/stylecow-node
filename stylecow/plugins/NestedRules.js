var mergeNestedRules = function (pos) {
	var child = this.children[pos],
		childSelectors = child.selector.selectors;

	while (child.children.length) {
		var nested = child.children[0];
		var nestedSelectors = nested.selector.selectors;

		nested.selector.remove();

		nestedSelectors.forEach(function (selector) {
			selector = (selector[0] === '&') ? selector.substr(1) : ' ' + selector;

			childSelectors.forEach(function (pref) {
				nested.selector.add(pref + selector);
			});
		});

		this.addChild(nested, pos++, true);
	}
};


var apply = function (options) {
	var k = 0, child, childSelectors;

	while (this.children[k]) {
		if (!this.children[k].selector.type) {
			mergeNestedRules.call(this, k);
		} else {
			apply.call(this.children[k]);
		}

		k++;
	}
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};