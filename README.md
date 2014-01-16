Stylecow
========

Created by Oscar Otero <http://oscarotero.com> <oom@oscarotero.com>

License: MIT

Stylecow is a node package that allows parsing and manipulating css files. It's a node port of the original package written in PHP https://github.com/oscarotero/stylecow


Why another CSS preprocessor?
------------------------------

The main purpose of Stylecow is to bring more CSS support to all browsers. You write CSS and you get CSS. You don't have to learn another different language such LESS, SASS, etc. Stylecow converts your code to be more compatible with all browsers throught plugins without writing any non-standard code. There is a plugin to add automatically the vendor prefixes to all selectors, properties and values in need. There is another plugin that allows using rem values with fallback for IE<=8. There is a plugin to use css variables with the same syntax of the w3c standard (http://dev.w3.org/csswg/css-variables/). And other plugins emulate some CSS effects (rotate, opacity, etc) in IE using the property "filter". So you can use Stylecow just to fix your modern CSS code and make it compatible with old browsers. And if you stop using Stylecow, your CSS code will remain CSS code.
