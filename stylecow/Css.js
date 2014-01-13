var Selector = require('./Selector.js'),
	Property = require('./Property.js'),
	Utils = require('./Utils.js');

function repeat (pattern, count) {
	var result = '';

	while (count > 0) {
		result += pattern;
		count--;
	}

	return result;
}



function Css (selector) {
	this.parent = null;
	this.selector = null;
	this.properties = [];
	this.children = [];
	this.comments = [];
	this.vendor = null;

	if (selector) {
		this.selector = selector;
	} else {
		this.selector = Selector.create();
	}

	this.selector.setParent(this);
}

Css.prototype = {
	clone: function () {
		var copy = new Css(this.selector.clone());

		this.properties.forEach(function (property) {
			copy.addProperty(property.clone());
		});

		this.children.forEach(function (child) {
			copy.addChild(child.clone());
		});

		copy.comments = Utils.clone(this.comments);

		return copy;
	},
	addChild: function (child, index, after) {
		child.setParent(this);

		if (index === undefined || (after && index === this.children.length)) {
			this.children.push(child);
		} else {
			this.children.splice(after ? index + 1 : index, 0, child);
		}

		return child;
	},
	getChildren: function (filter) {
		if (!filter) {
			return Utils.clone(this.children);
		}

		var children = [];

		this.children.forEach(function (child) {
			if (child.selector.is(filter)) {
				children.push(child);
			}
		});

		return children;
	},
	getProperties: function (name, value) {
		if (!name) {
			return Utils.clone(this.properties);
		}

		var properties = [];

		this.properties.forEach(function (property) {
			if (property.is(name, value)) {
				properties.push(property);
			}
		});

		return properties;
	},
	hasProperty: function (name, value) {
		for (var i = 0, total = this.properties.length; i < total; i++) {
			if (this.properties[i].is(name, value)) {
				return true;
			}
		}

		return false;
	},
	addProperty: function (property, index) {
		property.setParent(this);

		if (index === undefined) {
			this.properties.push(property);
		} else {
			this.properties.splice(index, 0, property);
		}

		return property;
	},
	removeProperty: function (index) {
		this.properties.splice(index, 1);
	},
	addMsFilterProperty: function (filter) {
		var property = this.getProperties('filter').pop();

		if (property) {
			if (property.value === 'none') {
				property.value = filter;
			} else {
				property.addValue(filter);
			}
			property.vendor = 'ms';
		} else {
			this.addProperty(Property.create('filter', filter)).vendor = 'ms';
		}
	},
	setParent: function (parent) {
		if (this.parent && this.parent.children.length) {
			var children = this.parent.children;

			for (var i = 0, total = children.length; i < total; i++) {
				if (children[i] === this) {
					children.splice(i, 1);
					break;
				}
			}
		}

		this.parent = parent;
	},
	index: function () {
		if (this.parent) {
			return this.parent.children.indexOf(this);
		}

		return -1;
	},
	getRoot: function () {
		if (this.parent === null) {
			return null;
		}

		var parent = this.parent;

		while (parent.parent && !parent.selector.type) {
			parent = parent.parent;
		}

		return parent;
	},
	isRoot: function () {
		return (!this.parent || !this.parent.parent);
	},
	executeRecursive: function (fn, data) {
		var propagateData = Utils.clone(data);

		fn.call(this, propagateData);

		this.getChildren().forEach(function (child) {
			child.executeRecursive(fn, propagateData);
		});
	},
	toString: function (options) {
		options = options || {};

		options.indent = options.indent || 0;

		var selector = this.selector.toString(),
			properties = '',
			comments = '',
			indentation = repeat("\t", options.indent);

		//if (options.comments && this.comments.length) {
		//	comments = indentation + '/*' + this.comments.join(', ') + '*/' + "\n";
		//}

		/*if (!empty($options['sourceMap'])) {
			$comments .= empty($this->sourceMap) ? '' : $indentation.'/* line: '.$this->sourceMap[0];
			
			if (!empty($this->sourceMap[2])) {
				$comments .= ', '.$this->sourceMap[2];
			}
*/
			//$comments .= ' */'."\n";
//		}
		

		if (this.properties.length) {
			var indProp = selector ? (indentation + "\t") : indentation;

			this.properties.forEach(function (property) {
				properties += indProp + property.toString() + ";\n";
			});
		}

		if (this.children.length) {
			var childOptions = {
				indent: options.indent + (selector ? 1 : 0),
				comments: options.comments
			};

			this.children.forEach(function (child) {
				properties += "\n" + child.toString(childOptions);
			});
		}

		if (properties && selector) {
			return comments + indentation + selector + " {\n" + properties + indentation + "}\n";
		}

		if (properties) {
			return properties;
		}

		if (selector && this.selector.type) {
			return comments + indentation + selector + ";\n";
		}

		return '';
	}
}

module.exports = {
	create: function (selector) {
		return new Css(selector);
	}
};