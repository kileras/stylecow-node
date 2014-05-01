var tree = require('../tree');
var utils = require('../utils');

var vendorPrefixes = {
	selectors: [
		{
			'regexp': /::selection/,
			'prefixes': {
				'moz': false
			}
		},{
			'regexp': /::input-placeholder/,
			'prefixes': {
				'webkit': false,
				'moz': false,
				'ms': false
			}
		},{
			'regexp': /^@keyframes/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 16.0},
				'o': {'opera': 12.1}
			}
		},{
			'regexp': /^@document/,
			'prefixes': {
				'moz': false
			}
		},{
			'regexp': /:fullscreen/,
			'prefixes': {
				'ms': false
			}
		}
	],
	rules: [
		{
			'regexp': /^animation(-.*)?/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 16.0},
				'o': {'opera': 12.1}
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
				'moz': {'firefox': 16.0},
				'o': {'opera': 12.1},
				'ms': {'explorer': 10.0}
			}
		},{
			'regexp': /^grid(-.*)?/,
			'prefixes': {
				'ms': false
			}
		},{
			'regexp': /^transition(-.*)?/,
			'prefixes': {
				'webkit': {'chrome': 26.0, 'safari': 6.1, 'android': 4.4},
				'moz': {'firefox': 16.0},
				'o': {'opera': 12.1}
			}
		},{
			'regexp': /^tab-size$/,
			'prefixes': {
				'moz': false,
				'o': {'opera': 15.0}
			}
		},{
			'regexp': /^font-feature-settings$/,
			'prefixes': {
				'moz': false,
				'webkit': false
			}
		},{
			'regexp': /^border(-.*)?-image$/,
			'prefixes': {
				'webkit': {'chrome': 16.0, 'safari': 6.0, 'android': 4.4},
				'moz': {'firefox': 15.0},
				'o': {'opera': 15.0}
			}
		},{
			'regexp': /^border-(after|before).*/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /^background-(size|clip|origin)$/,
			'prefixes': {
				'webkit': {'android': 3.0},
				'moz': {'firefox': 4.0},
				'o': {'opera': 10.5}
			}
		},{
			'regexp': /^box-sizing$/,
			'prefixes': {
				'webkit': {'chrome': 10.0, 'safari': 5.1, 'ios': 5.0, 'android': 4.0},
				'moz': {'firefox': 29.0}
			}
		},{
			'regexp': /^text-align-last$/,
			'prefixes': {
				'moz': false
			}
		},{
			'regexp': /^border-radius$/,
			'prefixes': {
				'webkit': {'chrome': 5.0, 'safari': 5.0, 'ios': 4.0, 'android': 2.2},
				'moz': {'firefox': 4.0}
			}
		},{
			'regexp': /^border-(start|end).*/,
			'prefixes': {
				'webkit': false,
				'moz': false
			}
		},{
			'regexp': /^border-(.*)-radius$/,
			'prefixes': {
				'webkit': {'chrome': 5.0, 'safari': 5.0, 'ios': 4.0, 'android': 2.2}
			}
		},{
			'regexp': /^box-shadow$/,
			'prefixes': {
				'webkit': {'chrome': 10.0, 'safari': 5.1, 'ios': 5.0, 'android': 4.0},
				'moz': {'firefox': 4.0}
			}
		},{
			'regexp': /^backface-visibility$/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 16.0}
			}
		},{
			'regexp': /^perspective(-origin.*)?$/,
			'prefixes': {
				'webkit': false,
				'moz': {'firefox': 16.0}
			}
		},{
			'regexp': /^mask(-.*)?$/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /^text-overflow$/,
			'prefixes': {
				'o': {'opera': 11.0}
			}
		},{
			'regexp': /^text-size-adjust$/,
			'prefixes': {
				'ms': false,
				'moz': false
			}
		},{
			'regexp': /^object-fit$/,
			'prefixes': {
				'o': {'opera': 15.0}
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
				'webkit': false
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
			'regexp': /^region-fragment$/,
			'prefixes': {
				'webkit': false
			}
		},{
			'regexp': /^flow-(into|from)$/,
			'prefixes': {
				'ms': false,
				'webkit': false
			}
		},{
			'regexp': /cursor/,
			'values': [
				{
					'regexp': /^zoom-(in|out)$/,
					'prefixes': {
						'webkit': false,
						'moz': {'firefox': 24.0}
					}
				},{
					'regexp': /^grab(bing)?$/,
					'prefixes': {
						'webkit': false,
						'moz': {'firefox': 27.0}
					}
				}
			]
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
						'moz': {'firefox': 3.0}
					}
				}
			]
		},{
			'regexp': /^(min-|max-)?(width|height)$/,
			'values': [
				{
					'regexp': /^(max|min|fit)-content$/,
					'prefixes': {
						'moz': false,
						'webkit': false
					}
				},{
					'regexp': /^(fill-available)$/,
					'prefixes': {
						'webkit': false
					}
				}
			]
		},{
			'regexp': /^position$/,
			'values': [
				{
					'regexp': /^sticky$/,
					'prefixes': {
						'webkit': false
					}
				}
			]
		},{
			'regexp': /.*/,
			'values': [
				{
					'regexp': /(^|[^\w-])(calc\()/,
					'regexpPrepend': true,
					'prefixes': {
						'webkit': {'chrome': 26.0, 'safari': 6.1, 'ios': 7.0},
						'moz': {'firefox': 16.0}
					}
				}
			]
		}
	]
};

var getRulePrefixes = function (name, value, support) {
	var prefixes = [];

	vendorPrefixes.rules.forEach(function (vendor) {
		var prefix;

		if (vendor.regexp.test(name)) {
			if (vendor.prefixes) {
				for (prefix in vendor.prefixes) {
					if (utils.needSupport(support, vendor.prefixes[prefix])) {
						prefixes.push({
							name: '-' + prefix + '-' + name,
							value: value,
							vendor: prefix
						});
					}
				}
			}

			if (vendor.values && value) {
				vendor.values.forEach(function (vendor) {
					if (vendor.regexp.test(value)) {
						for (prefix in vendor.prefixes) {
							if (utils.needSupport(support, vendor.prefixes[prefix])) {
								prefixes.push({
									name: name,
									value: value.replace(vendor.regexp, function (matches, p1, p2) {
										if (vendor.regexpPrepend === true) {
											return p1 + '-' + prefix + '-' + p2;
										}

										return '-' + prefix + '-' + matches;
									}),
									vendor: prefix
								});
							}
						}
					}
				});
			}
		}
	});

	return prefixes;
};

var getSelectorPrefixes = function (selectors, support) {
	var selectorString = selectors.join(',');
	var prefixes = [];

	vendorPrefixes.selectors.forEach(function (vendor) {
		if (vendor.regexp.test(selectorString)) {

			for (var prefix in vendor.prefixes) {
				if (!utils.needSupport(support, vendor.prefixes[prefix])) {
					continue;
				}

				var copy = [];

				selectors.forEach(function (selector) {
					selector = selector.replace(vendor.regexp, function (matches) {
						if (matches[0] === ':') {
							if (matches[1] === ':') {
								return '::-' + prefix + '-' + matches.substr(2);
							}
							return ':-' + prefix + '-' + matches.substr(1);
						}

						if (matches[0] === '@') {
							return '@-' + prefix + '-' + matches.substr(1);
						}

						return '-' + prefix + '-' + matches;
					});

					copy.push(selector);
				});

				prefixes.push({
					selectors: copy,
					vendor: prefix
				});
			}
		}
	});

	return prefixes;
};


module.exports = {
	selector: function (data, settings) {
		var prefixes = getSelectorPrefixes(this.selectors, settings.support);

		prefixes.forEach(function (each) {
			var copy = this.parent.clone();
			copy.selector.set(each.selectors)
			copy.vendor = each.vendor;

			this.parent.parent.add(copy, this.parent.index());
		}, this);
	},
	rule: function (data, settings) {

		//Prefixes in all rules
		var prefixes = getRulePrefixes(this.name, this.value, settings.support);

		prefixes.forEach(function (each) {
			this.parent.add(new tree.rule(each.name, each.value), this.index()).vendor = each.vendor;
		}, this);

		//Prefixes in transition/transition-property
		var matches = this.name.match(/^\-([a-z]+)\-transition(\-property)?$/);

		if (matches) {
			var prefix = matches[1];
			var propertyName = this.value;
			var propertyMode = (matches[2] ? true : false); //transition or transition-property?

			if (!propertyMode) {
				propertyName = propertyName.split(' ', 2)[0];
			}

			prefixes = getRulePrefixes(propertyName, undefined, settings.support);

			prefixes.forEach(function (each) {
				if (each.vendor === prefix) {
					if (!propertyMode) {
						propertyName = propertyName.split(' ', 2);
						propertyName[0] = each.name;
						each.name = propertyName.join(' ');
					}

					this.value = each.name;
				}
			}, this);
		}
	},
	enabled: true,
	description: 'Add automatically the vendor prefixes for common browsers'
};
