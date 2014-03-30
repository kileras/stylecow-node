var stylecow = require('./lib');
var file = 'test.css';

var css = new stylecow();

css.loadFile(file);

css.transform();

process.stdout.write(css.toString() + '\n');
