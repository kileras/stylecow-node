var plugins = require('./plugins');
var utils = require('./utils');

var info = {
	version: '0.1.0',
	defaults: {
		support: {
			'explorer': 8.0,
			'firefox': 15.0,
			'chrome': 25.0,
			'safari': 5.0,
			'opera': 12.0,
			'android': 4.0,
			'ios': 5.0
		}
	},
	print: function() {
		var name, spaces;

		console.log("");
		console.log("------------------");
		console.log("STYLECOW");
		console.log("version: " + info.version);
		console.log("------------------");
		console.log("");
		console.log("usage: stylecow <source> [option=parameter ...]");
		console.log("");
		console.log("options:");

		for (name in info.defaults.support) {
			spaces = utils.repeat(' ', 15 - name.length);

			console.log("--" + name + "=VERSION" + spaces + "Minimum support for " + name + ". By default: " + info.defaults.support[name].toFixed(1));
		}

		console.log("");
		console.log("--enable=PLUGINS         Enable some plugins disabled by default. Use comma to specify various plugins");
		console.log("--disable=PLUGINS        Disable some plugins enabled by default. Use comma to specify various plugins");
		console.log("");
		console.log("available plugins:");

		for (name in plugins) {
			spaces = utils.repeat(' ', 25 - name.length);

			console.log(name  + spaces + (plugins[name].enabled ? 'enabled  ' : 'disabled ') + plugins[name].description);
		}
	}
};

module.exports = info;