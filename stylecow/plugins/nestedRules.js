var init = function (ruleset) {
	var k = 0;

	while (ruleset.children[k]) {
		if (!ruleset.children[k].selector.type) {
			mergeNestedRules(ruleset, k);
		} else {
			init(ruleset.children[k]);
		}

		k++;
	}
};

var mergeNestedRules = function (ruleset, pos) {
	var child = ruleset.children[pos],
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

		ruleset.addChild(nested, pos++, true);
	}
};


module.exports = {
	init: function () {
		init(this);
	},
	enabled: true
};
