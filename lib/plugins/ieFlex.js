var tree = require('../tree');

var getMsPropertyName = function (name) {
	switch (name) {
		case 'flex-wrap':
			return '-ms-flex-wrap';

		case 'order':
			return '-ms-flex-order';

		case 'justify-content':
			return '-ms-flex-pack';

		case 'align-items':
			return '-ms-flex-align';

		case 'align-self':
			return '-ms-flex-item-align';

		case 'align-content':
			return '-ms-flex-line-pack';
	}

	if (/^flex/.test(name)) {
		return '-ms-' + name;
	}
};

var getMsPropertyValue = function (name, value) {
	switch (name) {
		case '-ms-flex-wrap':
			if (value === 'nowrap') {
				return 'none';
			}
			break;

		case '-ms-flex-line-pack':
		case '-ms-flex-align':
		case '-ms-flex-item-align':
		case '-ms-flex-pack':
			if (value === 'flex-start') {
				return 'start';
			}
			if (value === 'flex-end') {
				return 'end';
			}
			break;
	}
};

module.exports = {
	rule: function () {
		var newname = getMsPropertyName(this.name), newvalue, newrule;

		if (newname) {
			newvalue = getMsPropertyValue(newname, this.value) || this.value;
			newrule = this.parent.add(new tree.rule(newname, newvalue), this.index());
		}

		if (this.is('display', 'flex')) {
			this.parent.add(new tree.rule('display', '-ms-flexbox'), this.index());
		} else if (this.is('display', 'inline-flex')) {
			this.parent.add(new tree.rule('display', '-ms-inline-flexbox'), this.index());
		}
	},
	enabled: true,
	description: 'Fallback with the old flexbox syntax in explorer 10',
	support: {
		'explorer': 11.0
	}
};

//http://msdn.microsoft.com/en-us/library/ie/dn265027%28v=vs.85%29.aspx