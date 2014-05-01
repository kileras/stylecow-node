module.exports = {
	support: {
		'explorer': 8.0,
		'firefox': 15.0,
		'chrome': 25.0,
		'safari': 5.0,
		'opera': 12.0,
		'android': 4.0,
		'ios': 5.0
	},
	codeStyles: {
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
	}
};
