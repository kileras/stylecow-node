var Property = require('../Property.js');

var vendorPrefixes = {
	selectors: [
		{
			'regexp': /::(selection)/,
			'prefixes': {
				'moz': '*'
			}
		},{
			'regexp': /::(input-placeholder)/,
			'prefixes': {
				'webkit': '*',
				'moz': '*',
				'ms': '*'
			}
		},{
			'regexp': /^@keyframes/,
			'prefixes': {
				'webkit': '*',
				'moz': {'firefox': '15.0'},
				'o': {'opera': '12.0'}
			}
		},{
			'regexp': /^@document/,
			'prefixes': {
				'moz': '*'
			}
		}
	],
	properties: [
		{
			'regexp': /^animation(-.*)?/,
			'prefixes': {
				'webkit': '*',
				'moz': {'firefox': '15.0'},
				'o': {'opera': '12.0'}
			}
		},{
			'regexp': /^(columns|column-.*)/,
			'prefixes': {
				'webkit': '*',
				'moz': '*'
			}
		},{
			'regexp': /^transform(-.*)?/,
			'prefixes': {
				'webkit': '*',
				'moz': {'firefox': '15.0'},
				'o': {'opera': '12.0'},
				'ms': {'explorer': '9.0'}
			}
		},{
			'regexp': /^grid(-.*)?/,
			'prefixes': {
				'ms': '*'
			}
		},{
			'regexp': /^transition(-.*)?/,
			'prefixes': {
				'webkit': {'chrome': '25.0', 'safari': '6.0', 'android': '4.3'},
				'moz': {'firefox': '15.0'},
				'o': {'opera': '12.0'}
			}
		},{
			'regexp': /^border(-.*)?-image$/,
			'prefixes': {
				'webkit': {'chrome': '15.0', 'safari': '5.1', 'android': '4.3'},
				'moz': {'firefox': '14.0'},
				'o': {'opera': '12.1'}
			}
		},{
			'regexp': /^border-(after|before).*/,
			'prefixes': {
				'webkit': '*'
			}
		},{
			'regexp': /^background-(size|clip|origin)$/,
			'prefixes': {
				'webkit': {'android': '2.3'},
				'moz': {'firefox': '3.6'},
				'o': {'opera': '10.1'}
			}
		},{
			'regexp': /^box-sizing$/,
			'prefixes': {
				'webkit': {'chrome': '9.0', 'safari': '5.0', 'ios': '4.3', 'android': '3.0'},
				'moz': '*'
			}
		},{
			'regexp': /^border-(.*)radius$/,
			'prefixes': {
				'webkit': {'chrome': '4.0', 'safari': '4.0', 'ios': '3.2', 'android': '2.1'},
				'moz': {'firefox': '3.6'}
			}
		},{
			'regexp': /^box-shadow$/,
			'prefixes': {
				'webkit': {'chrome': '9.0', 'safari': '5.0', 'ios': '4.3', 'android': '3.0'},
				'moz': {'firefox': '3.6'}
			}
		},{
			'regexp': /^backface-visibility$/,
			'prefixes': {
				'webkit': '*',
				'moz': {'firefox': '15.0'}
			}
		},{
			'regexp': /^perspective$/,
			'prefixes': {
				'webkit': '*',
				'moz': {'firefox': '15.0'}
			}
		},{
			'regexp': /^text-overflow$/,
			'prefixes': {
				'o': {'opera': '10.6'}
			}
		},{
			'regexp': /^user-select$/,
			'prefixes': {
				'webkit': '*',
				'moz': '*',
				'ms': '*'
			}
		},{
			'regexp': /^hyphens$/,
			'prefixes': {
				'webkit': '*',
				'moz': '*',
				'ms': '*'
			}
		},{
			'regexp': /^appearance$/,
			'prefixes': {
				'webkit': '*',
				'moz': '*'
			}
		},{
			'regexp': /^flex(-.*)?/,
			'prefixes': {
				'webkit': '*',
				'ms': {'explorer': '10.0'}
			}
		},{
			'regexp': /^align-.*?/,
			'prefixes': {
				'webkit': '*'
			}
		},{
			'regexp': /^justify-content$/,
			'prefixes': {
				'webkit': '*'
			}
		},{
			'regexp': /^order$/,
			'prefixes': {
				'webkit': '*'
			}
		},{
			'regexp': /display/,
			'values': [
				{
					'regexp': /^(inline-)?flex$/,
					'prefixes': {
						'webkit': '*'
					}
				},{
					'regexp': /^(inline-block)$/,
					'prefixes': {
						'moz': {'firefox': '2.0'}
					}
				}
			]
		},{
			'regexp': /.*/,
			'values': [
				{
					'regexp': /calc\(/,
					'prefixes': {
						'webkit': {'chrome': '25.0', 'safari': '6.0', 'ios': '6.1'},
						'moz': {'firefox': '15.0'}
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

var apply = function (options) {
	this.executeRecursive(function () {
		var selectorString = this.selector.toString();

		vendorPrefixes.selectors.forEach(function (vendor) {
			if (vendor.regexp.test(selectorString)) {
				var index = this.index();

				for (var prefix in vendor.prefixes) {
					var css = this.clone();

					css.selector.selectors.forEach(function (selector, index) {
						css.selector.selectors[index] = selector.replace(vendor.regexp, function (matches) {
							if (matches[1] === ':') {
								return '::-' + prefix + '-' + matches.substr(2);
							}

							if (matches[0] === '@') {
								return '@-' + prefix + '-' + matches.substr(1);
							}

							return '-' + prefix + '-' + matches;
						});
					});

					this.parent.addChild(css, index).vendor = prefix;
				}
			}
		}, this);

		this.getProperties().forEach(function (property, key) {
			vendorPrefixes.properties.forEach(function (vendor) {
				if (vendor.regexp.test(property.name)) {
					var index = property.index();

					if (vendor.prefixes) {
						for (var prefix in vendor.prefixes) {
							var name = '-' + prefix + '-' + property.name;

							property.parent.addProperty(Property.create(name, property.value), index).vendor = prefix;
						}
					}

					if (vendor.values) {
						vendor.values.forEach(function (vendor) {
							if (vendor.regexp.test(property.value)) {
								for (prefix in vendor.prefixes) {
									var value = property.value.replace(vendor.regexp, function (matches) {
										return '-' + prefix + '-' + matches;
									});

									property.parent.addProperty(Property.create(property.name, value), index).vendor = prefix;
								}
							}
						});
					}
				}
			});
		});
	});
};

module.exports = {
	apply: function (css, options) {
		apply.call(css, options);
	}
};