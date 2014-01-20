var stylecow = require('./lib');

var file = 'test.css';
var css = stylecow.loadFile(file, true);

css.transform();

process.stdout.write(css.toString() + '\n');
