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
			"ruleEnd": ";\n",
			"commentStart": "/* ",
			"commentEnd": " */\n",
			"rulesetStart": " {\n",
			"rulesetEnd": "}\n",
			"comments": "important" // (all|important|none)
		},
		"minify": {
			"rulesetIndent": "",
			"selectorJoiner": ",",
			"ruleColon": ":",
			"ruleEnd": ";",
			"commentStart": "",
			"commentEnd": "",
			"rulesetStart": "{",
			"rulesetEnd": "}",
			"comments": "none",
		}
	}
};
