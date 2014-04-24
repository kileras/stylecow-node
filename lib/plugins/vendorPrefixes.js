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
				'moz': false
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


module.exports = {
	selector: function (data, settings) {
		var selectorString = this.toString();
		var ruleset = this.parent;
		var support = settings.support;

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
					});

					ruleset.parent.add(child, index).vendor = prefix;
				}
			}
		});
	},
	rule: function (data, settings) {
		var support = settings.support;

		vendorPrefixes.rules.forEach(function (vendor) {
			var prefix;

			if (vendor.regexp.test(this.name)) {
				var index = this.index();

				if (vendor.prefixes) {
					for (prefix in vendor.prefixes) {
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
									var value = this.value.replace(vendor.regexp, function (matches, p1, p2) {
										if (vendor.regexpPrepend === true) {
											return p1 + '-' + prefix + '-' + p2;
										}

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

		//Special case for transition and transition-property
		var matches = this.name.match(/^\-([a-z]+)\-transition(\-property)?$/);

		if (matches) {
			var prefix = matches[1], modeProperty = (matches[2] ? true : false), value = this.value, newValue;

			if (!modeProperty) {
				value = this.value.split(' ', 2)[0];
			}

			vendorPrefixes.rules.some(function (vendor) {
				if (vendor.regexp.test(value) && vendor.prefixes && (prefix in vendor.prefixes) && utils.needSupport(support, vendor.prefixes[prefix])) {
					newValue = '-' + prefix + '-' + value;
					return true;
				}
			});

			if (newValue) {
				if (modeProperty) {
					this.value = newValue;
				} else {
					value = this.value.split(' ', 2);
					value[0] = newValue;
					this.value = value.join(' ');
				}
			}
		}
	},
	enabled: true,
	description: 'Add automatically the vendor prefixes for common browsers'
};
