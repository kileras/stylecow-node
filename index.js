var stylecow = require('./lib');
var fs = require('fs');

var css = stylecow.load(fs.readFileSync('test.css', 'utf8'), true);

css.transform();

process.stdout.write(css.toString() + '\n');
