const fs = require ('fs');
const os = require('os');
const break_line = os.EOL;// /(\r\n)|(\n)/g;

function debug (debugLogPath)
{
	let private = {};
	// private.stream = private.cacheStream = fs.createWriteStream(debugLogPath, {flags: "a"});
	
	let public = {};
	public.log = (...param) =>
	{
		let line = param.join ("	");
		// private.stream.write(line + break_line, "utf-8");
		fs.appendFile(debugLogPath, line + break_line, (err) => {});
		// console.log (line);
	};	
		
	return public;
}

module.exports = debug;