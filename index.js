var styleCow = require('./stylecow/index.js');

var css = styleCow.loadFile('./test2.css');

styleCow.transform(css);

console.log(css.toString());



//console.log(result);

//styleCow.transform(css);
/*
css.transform(function () {
	
}, function () {
	if (this.name === 'opacity') {
		this.parent.addMsFilter('alpha(opacity=' + (parseFloat(this.value, 10) * 100) + ')');
	}
}, function () {
	
});

console.log(css.toString());
*/

/*
BaseUrl
Grid
Math
MediaQuery
*/
