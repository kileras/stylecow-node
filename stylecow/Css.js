var Selector = require('./Selector.js');

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

	if (selector) {
		this.selector = selector;
	} else {
		this.selector = Selector.create();
	}

	this.selector.setParent(this);
}

Css.prototype = {
	addChild: function (child, position) {
		child.setParent(this);

		if (!position) {
			this.children.push(child);
		} else {
			this.children.splice(position, 0, child);
		}

		return child;
	},
	addProperty: function (property, position) {
		property.setParent(this);

		if (!position) {
			this.properties.push(property);
		} else {
			this.properties.splice(position, 0, property);
		}

		return property;
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
		fn.call(this, data);

		var children = [], i, total;

		for (i = 0, total = this.children.length; i < total; i++) {
			children.push(this.children[i]);
		}

		for (i = 0, total = children.length; i < total; i++) {
			children[i].executeRecursive(fn, data);
		}
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

			for (var i = 0, total = this.properties.length; i < total; i++) {
				properties += (indProp + this.properties[i].toString() + ";\n");
			}
		}

		if (this.children.length) {
			var childOptions = {
				indent: options.indent + (selector ? 1 : 0),
				comments: options.comments
			};

			for (var i = 0, total = this.children.length; i < total; i++) {
				properties += "\n" + this.children[i].toString(childOptions);
			}
		}

		if (properties && selector) {
			return comments + indentation + selector + " {\n" + properties + indentation + "}\n";
		}

		if (properties) {
			return properties;
		}

		if (selector) {
			return comments + indentation + selector + ";\n";
		}
	}
}

module.exports = {
	create: function (selector) {
		return new Css(selector);
	}
};