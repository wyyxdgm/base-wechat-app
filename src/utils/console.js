var CONFIG = require('../config');
const V = require('./v');
if (CONFIG.env !== V.ENV.DEV) {
	let _log = console.log;
	console.log = function() {
		if (CONFIG.debug) _log.apply(console, arguments);
	}
}