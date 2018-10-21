const exec = require('child_process');

process.argv.forEach(function (val, index, array)
{
	console.log(index + ': ' + val);
});

let cmd = process.argv [2].trim().toLowerCase();
switch (cmd)
{
	case "server":
		exec ("");
		break;
	
	case "client":
		break;
}