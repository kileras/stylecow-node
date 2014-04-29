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

var codeStyles = {
	"default": {
		"rulesetIndent": "\t",
		"selectorJoiner": ", ",
		"ruleColon": ": ",
		"ruleStart": "\t",
		"ruleEnd": ";\n",
		"rulesetStart": " {\n",
		"rulesetEnd": "}\n"
	},
	"minify": {
		"rulesetIndent": "",
		"selectorJoiner": ",",
		"ruleColon": ":",
		"ruleStart": "",
		"ruleEnd": ";",
		"rulesetStart": "{",
		"rulesetEnd": "}"
	}
};

var styleCow = function () {
	this.css = undefined;
	this.process = {};
	this.settings = {};
	this.cliSettings = [];
	this.codeSettings = utils.clone(codeStyles.default);
};

styleCow.prototype = {
	load: function (code) {
		var k;

		this.css = parser.parseRuleset(code);

		this.css.settings = {
			support: utils.clone(defaultSupport),
			plugins: {}
		};

		for (k in plugins) {
			this.css.settings.plugins[k] = {
				enabled: plugins[k].enabled
			};
		}

		this.css.info = {};
	},

	loadFile: function (file) {
		this.load(fs.readFileSync(file, 'utf8'));

		this.css.setSourceFile(file);
		this.css.info.files = [file];
	},

	output: function (file) {
		if (file) {
			fs.writeFileSync(file, this.css.toString(this.codeSettings));
		} else {
			console.log(this.css.toString(this.codeSettings));
		}
	},

	setSettings: function (settings) {
		if (!this.configFileLoaded && settings.input && !(settings.config)) {
			var configFile = settings.input + '.json';
			
			if (fs.existsSync(configFile)) {
				settings.config = configFile;
				this.configFileLoaded = true;
			}
		}

		if (settings.config) {
			this.setSettings(JSON.parse(fs.readFileSync(settings.config, 'utf8')));
		}

		for (var name in settings) {
			switch (name) {
				case 'watch':
				case 'output':
				case 'input':
					this.process[name] = settings[name];
					break;

				case 'config':
					break;

				case 'code':
					if (settings[name] instanceof Object) {
						for (var k in settings[name]) {
							this.codeSettings[k] = settings[name][k];
						}
					} else if (codeStyles[settings[name]]) {
						this.codeSettings = utils.clone(codeStyles[settings[name]]);
					} else {
						console.error('no valid code style');
					}
					break;

				default:
					this.settings[name] = settings[name];
			}
		}
	},

	setCliSettings: function (settings) {
		var process = {};

		settings.forEach(function (arg) {
			var match = arg.match(/^--?([a-z][0-9a-z\.]*)(?:=(.*))?$/i);

			switch (match[1]) {
				case 'watch':
				case 'output':
				case 'input':
				case 'config':
				case 'code':
					process[match[1]] = match[2] || true;
					break;

				default:
					this.cliSettings.push(arg);
			}
		}, this);

		this.setSettings(process);
	},

	transform: function () {
		var key;

		for (key in this.settings) {
			this.css.setSetting(key, this.settings[key]);
		}

		this.cliSettings.forEach(function (arg) {
			this.css.setCliSetting(arg);
		}, this);

		this.css.transform();
	},

	watch: function (callback) {
		if (this.watching) {
			return;
		}

		this.watching = true;

		this.css.info.files.forEach(function (file) {
			console.log('watching ' + file);

			fs.watchFile(file, {persistent: true, interval: 2000}, function (curr, prev) {
				if (curr.mtime !== prev.mtime) {
					console.log('changed: ' + file);
					callback();
				}
			});
		});
	},

	execute: function () {
		if (!this.process.input) {
			console.log('input filename is required: stylecow <filename> (--options) or --input=filename.css');
			process.exit(1);
		}

		this.loadFile(this.process.input);
		this.transform();
		this.output(this.process.output);

		if (this.process.watch && !this.watching) {
			this.watch(function () {
				this.execute();
			}.bind(this));
		}
	}
};

module.exports = styleCow;
