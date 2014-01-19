var tree = require('../tree');
var utils = require('../utils');

var vendorPrefixes = {
	selectors: [
		{
			'regexp': /::(selection)/,
			'prefixes': {
				'moz': false
			}
		},{
			'regexp': /::(input-placeholder)/,
			'prefixes': {
				'webkit': false,
				'moz': false,
				'ms': false
			}
		},{
			'regexp': /^@keyframes/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 15.0},
				'o': {'opera': 12.0}
			}
		},{
			'regexp': /^@document/,
			'prefixes': {
				'moz': false
			}
		}
	],
	rules: [
		{
			'regexp': /^animation(-.*)?/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 15.0},
				'o': {'opera': 12.0}
			}
		},{
			'regexp': /^(columns|column-.*)/,
			'prefixes': {
				'webkit': false,
				'moz': false
			}
		},{
			'regexp': /^transform(-.*)?/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 15.0},
				'o': {'opera': 12.0},
				'ms': {'explorer': 9.0}
			}
		},{
			'regexp': /^grid(-.*)?/,
			'prefixes': {
				'ms': false
			}
		},{
			'regexp': /^transition(-.*)?/,
			'prefixes': {
				'webkit': {'chrome': 25.0, 'safari': 6.0, 'android': 4.3},
				'moz': {'firefox': 15.0},
				'o': {'opera': 12.0}
			}
		},{
			'regexp': /^border(-.*)?-image$/,
			'prefixes': {
				'webkit': {'chrome': 15.0, 'safari': 5.1, 'android': 4.3},
				'moz': {'firefox': 14.0},
				'o': {'opera': 12.1}
			}
		},{
			'regexp': /^border-(after|before).*/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /^background-(size|clip|origin)$/,
			'prefixes': {
				'webkit': {'android': 2.3},
				'moz': {'firefox': 3.6},
				'o': {'opera': 10.1}
			}
		},{
			'regexp': /^box-sizing$/,
			'prefixes': {
				'webkit': {'chrome': 9.0, 'safari': 5.0, 'ios': 4.3, 'android': 3.0},
				'moz': false
			}
		},{
			'regexp': /^border-radius$/,
			'prefixes': {
				'webkit': {'chrome': 4.0, 'safari': 4.0, 'ios': 3.2, 'android': 2.1},
				'moz': {'firefox': 3.6}
			}
		},{
			'regexp': /^border-(.*)-radius$/,
			'prefixes': {
				'webkit': {'chrome': 4.0, 'safari': 4.0, 'ios': 3.2, 'android': 2.1}
			}
		},{
			'regexp': /^box-shadow$/,
			'prefixes': {
				'webkit': {'chrome': 9.0, 'safari': 5.0, 'ios': 4.3, 'android': 3.0},
				'moz': {'firefox': 3.6}
			}
		},{
			'regexp': /^backface-visibility$/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 15.0}
			}
		},{
			'regexp': /^perspective$/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 15.0}
			}
		},{
			'regexp': /^text-overflow$/,
			'prefixes': {
				'o': {'opera': 10.6}
			}
		},{
			'regexp': /^user-select$/,
			'prefixes': {
				'webkit': false,
				'moz': false,
				'ms': false
			}
		},{
			'regexp': /^hyphens$/,
			'prefixes': {
				'webkit': false,
				'moz': false,
				'ms': false
			}
		},{
			'regexp': /^appearance$/,
			'prefixes': {
				'webkit': false,
				'moz': false
			}
		},{
			'regexp': /^flex(-.*)?/,
			'prefixes': {
				'webkit': false,
				'ms': {'explorer': 10.0}
			}
		},{
			'regexp': /^align-.*?/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /^justify-content$/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /^order$/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /display/,
			'values': [
				{
					'regexp': /^(inline-)?flex$/,
					'prefixes': {
						'webkit': false
					}
				},{
					'regexp': /^(inline-block)$/,
					'prefixes': {
						'moz': {'firefox': 2.0}
					}
				}
			]
		},{
			'regexp': /.*/,
			'values': [
				{
					'regexp': /(^|[^\w-])calc\(/,
					'prefixes': {
						'webkit': {'chrome': 25.0, 'safari': 6.0, 'ios': 6.1},
						'moz': {'firefox': 15.0}
					}
				}
			]
		}
	]
};


/*
	array(
		'properties' => array(
			'-moz-transition',
			'-webkit-transition',
			'-o-transition',
			'-moz-transition-property',
			'-webkit-transition-property',
			'-o-transition-property'
		),
		'fn' => array(
			'transitionPropertyValue' => null
		)
	)
);
*/

module.exports = {
	selector: function (data, support) {
		var selectorString = this.toString();
		var ruleset = this.parent;

		vendorPrefixes.selectors.forEach(function (vendor) {
			if (vendor.regexp.test(selectorString)) {
				var index = ruleset.index();

				for (var prefix in vendor.prefixes) {
					if (!utils.needSupport(support, vendor.prefixes[prefix])) {
						continue;
					}

					var child = ruleset.clone();

					child.selector.selectors.forEach(function (selector, index) {
						child.selector.selectors[index] = selector.replace(vendor.regexp, function (matches) {
							if (matches[1] === ':') {
								return '::-' + prefix + '-' + matches.substr(2);
							}

							if (matches[0] === '@') {
								return '@-' + prefix + '-' + matches.substr(1);
							}

							return '-' + prefix + '-' + matches;
						});
					});

					ruleset.parent.add(child, index).vendor = prefix;
				}
			}
		});
	},
	rule: function (data, support) {
		vendorPrefixes.rules.forEach(function (vendor) {
			if (vendor.regexp.test(this.name)) {
				var index = this.index();

				if (vendor.prefixes) {
					for (var prefix in vendor.prefixes) {
						if (utils.needSupport(support, vendor.prefixes[prefix])) {
							var name = '-' + prefix + '-' + this.name;

							this.parent.add(new tree.rule(name, this.value), index).vendor = prefix;
						}
					}
				}

				if (vendor.values) {
					vendor.values.forEach(function (vendor) {
						if (vendor.regexp.test(this.value)) {
							for (prefix in vendor.prefixes) {
								if (utils.needSupport(support, vendor.prefixes[prefix])) {
									var value = this.value.replace(vendor.regexp, function (matches) {
										return '-' + prefix + '-' + matches;
									});

									this.parent.add(new tree.rule(this.name, value), index).vendor = prefix;
								}
							}
						}
					}, this);
				}
			}
		}, this);
	},
	enabled: true,
	description: 'Add automatically the vendor prefixes for common browsers'
};
