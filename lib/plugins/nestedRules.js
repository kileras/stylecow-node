var mergeNestedRules = function (parent, pos) {
	var base = parent.children[pos],
		baseSelectors = base.selector.selectors,
		nested,
		nestedSelectors;

	while (nested = base.getRulesets().shift()) {
		nestedSelectors = nested.selector.selectors;
		nested.selector.remove();

		nestedSelectors.forEach(function (selector) {
			selector = (selector[0] === '&') ? selector.substr(1) : ' ' + selector;

			baseSelectors.forEach(function (pref) {
				nested.selector.add(pref + selector);
			});
		});

		parent.add(nested, pos++, true);
	}
};

module.exports = {
	ruleset: function () {
		if (!this.selector.type) {
			mergeNestedRules(this.parent, this.index());
		}
	},
	enabled: true,
	description: 'Add support for nested rules'
};
