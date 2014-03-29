var fs = require('fs');
var parser = require('./parser');
var utils = require('./utils');
var plugins = require('./plugins');

var defaultSupport = {
	'explorer': 8.0,
	'firefox': 15.0,
	'chrome': 25.0,
	'safari': 5.0,
	'opera': 12.0,
	'android': 4.0,
	'ios': 5.0
};

var styleCow = function () {}

styleCow.prototype = {
	load: function (code, debug) {
		var k;

		this.css = parser.parseRuleset(code);

		this.css.settings = {
			support: utils.clone(defaultSupport),
			plugins: {}
		}

		for (k in plugins) {
			this.css.settings.plugins[k] = {
				enabled: plugins[k].enabled
			}
		}

		if (debug) {
			for (k in this.css.settings.support) {
				this.css.settings.support[k] = 0;
			}

			for (k in this.css.settings.plugins) {
				this.css.settings.plugins[k].enabled = true;
			}
		}

		this.css.info = {};
	},
	loadFile: function (file, debug) {
		this.load(fs.readFileSync(file, 'utf8'), debug);

		this.css.setSourceFile(file);
		this.css.info.files = [file];
	},
	output: function (file) {
		fs.writeFileSync(file, css.toString());
	},
	transform: function (settings) {
		if (settings) {
			settings.forEach(function (arg) {
				if (!this.setSetting(arg)) {
					console.log('Unrecognised argument: ' + arg);
					process.exit(1);
				}
			}, this.css);
		}

		this.css.transform();
	},
	toString: function () {
		return this.css.toString();
	},
	watch: function (callback) {
		this.css.info.files.forEach(function (file) {
			console.log('watching ' + file);

			fs.watchFile(file, {persistent: true, interval: 2000}, function (curr, prev) {
				if (curr.mtime !== prev.mtime) {
					console.log('changed: ' + file);
					callback();
				}
			});
		});
	}
};

module.exports = styleCow;
