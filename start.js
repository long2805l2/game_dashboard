const child_process = require('child_process');
const exitHook = require('exit-hook');
const fs = require('fs');
const config = require("./config.js");

process.argv.forEach(function (val, index, array)
{
	console.log(index + ': ' + val);
});

let cmd = process.argv.length > 2 ? process.argv [2].trim().toLowerCase() : "";
let option = { stdio: "inherit" , detached: false };
let childProcess = null;
let log = null;

switch (cmd)
{
	case "backend":
		option.cwd = "./app/backend";
		var nodemon =  "../../node_modules/nodemon/bin/nodemon.js";
		childProcess = child_process.spawn ("node", [nodemon, "index.js", "--max-old-space-size", "1024", "--watch", "../"], option);
		break;
	
	case "frontend":
		{	
			option.cwd = "./app/frontend";
			let ng = /^win/.test(process.platform) ? 'ng.cmd' : 'ng';
			childProcess = child_process.spawn (ng, ["serve", "--host", config.frontend.ip, "--port", config.frontend.port], option);
		}
		break;

	case "log":
		childProcess = child_process.spawn ("node", ["./app/log/index.js", "--max-old-space-size", "4098"], option);
		break;

	case "elastic":
		childProcess = child_process.spawn (config.elastic.path, [], option);
		break;

	case "kibana":
		childProcess = child_process.spawn (config.kibana.path, [], option);
		break;
}

if (childProcess)
{
	process.title = cmd;
	// log = fs.createWriteStream(cmd + ".log"); // + "." + Date.now()
	// childProcess.stdout.pipe(process.stdout);
	
	// let old = process.stdout._write.bind (process.stdout);
	// process.stdout._write = function(chunk, encoding, callback) {
	// 	old(chunk, encoding, callback);
	// 	log.write(chunk, encoding);
	// };

	console.log ("start", cmd, childProcess.pid);
}

exitHook(() =>
{
	if (!childProcess)
		return;

	console.log ("kill", cmd, childProcess.pid);
	childProcess.kill();
	// log.end();
});