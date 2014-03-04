var plugins = require('./plugins');
var utils = require('./utils');
var stylecow = require('./index');

var info = {
	print: function() {
		var name, spaces;

		console.log("");
		console.log("------------------");
		console.log("STYLECOW");
		console.log("version: 0.4.6");
		console.log("------------------");
		console.log("");
		console.log("usage: stylecow <source> [option=parameter ...]");
		console.log("");
		console.log("options:");

		for (name in stylecow.defaults.support) {
			spaces = utils.repeat(' ', 15 - name.length);

			console.log("--" + name + "=VERSION" + spaces + "Minimum support for " + name + ". By default: " + stylecow.defaults.support[name].toFixed(1));
		}

		console.log("");
		console.log("--enable=PLUGINS         Enable some plugins disabled by default. Use comma to specify various plugins");
		console.log("--disable=PLUGINS        Disable some plugins enabled by default. Use comma to specify various plugins");
		console.log("--input=FILENAME         Other way to set the input filename (instead use the first argument)");
		console.log("--output=FILENAME        Other way to set the output filename (instead use > FILENAME)");
		console.log("--PLUGIN.SETTING=VALUE   Edit a setting of a plugin");
		console.log("--watch                  Watch the changes in all css files (the main and imported files) and update the output");
		console.log("");
		console.log("available plugins:");

		for (name in plugins) {
			spaces = utils.repeat(' ', 25 - name.length);

			console.log(name  + spaces + (plugins[name].enabled ? 'enabled  ' : 'disabled ') + plugins[name].description);
		}
	}
};

module.exports = info;
