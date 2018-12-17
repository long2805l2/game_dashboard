var manager = {};
var private = {};
private.client = null;
private.hour = require ("./hourly.js");

manager.run = function (group)
{
	let analyst = private [group];
	if (!analyst)
	{
		console.log ("reporter cannot found " + group);
		return;
	}

	analyst.run (private.client);
};

manager.init = function (elastic)
{
	private.client = elastic;
}

module.exports = manager;