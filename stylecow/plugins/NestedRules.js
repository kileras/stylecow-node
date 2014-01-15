var mergeNestedRules = function (css, pos) {
	var child = css.children[pos],
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

		css.addChild(nested, pos++, true);
	}
};


(function (plugins) {
	plugins.nestedRules = function (css) {
		var k = 0, child, childSelectors;

		while (css.children[k]) {
			if (!css.children[k].selector.type) {
				mergeNestedRules(css, k);
			} else {
				plugins.nestedRules(css.children[k]);
			}

			k++;
		}
	};
})(require('../plugins'));