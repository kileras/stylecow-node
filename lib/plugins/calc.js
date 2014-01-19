module.exports = {
	functions: {
		calc: function (fn) {
			var operation = fn.params[0].replace(/\s*([\+\-])\s*/g, ' $1 ');

			return 'calc(' + operation + ')';
		}
	},
	enabled: true,
	description: 'Normalizes the calc() function that requires spaces around binary "+" and "-" operators'
};
