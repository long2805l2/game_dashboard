const lib = require('./lib.js');

function database (path)
{
	let absolutePath = lib.path.resolve(path);
	absolutePath = absolutePath.replace(/\\/g, "/");
	let dirs = absolutePath.split ("/");
	let checkPath = "";
	for(let i in dirs)
	{
		let dir = dirs [i];
		checkPath += dir + "/";
		if (lib.fs.existsSync (checkPath) && lib.fs.lstatSync(checkPath).isDirectory())
			continue;

		lib.fs.mkdirSync (checkPath);
	}
	
	var db = {
		path: absolutePath,
		salt: "",
		hash: ""
	};
	var stock = {};
		
	db.write = (key, value) =>
	{
		lib.fs.writeFileSync (db.path + "/" + key, value, "utf8");
		stock [key] = value;
	};

	db.read = (key) =>
	{
		if (key in stock)
			return stock [key];

		return undefined;
	};

	db.remove = (key) =>
	{
		if (key in stock)
			delete stock [key];

		if (lib.fs.existsSync (db.path + "/" + key))
			lib.fs.unlinkSync (db.path + "/" + key);
	};

	db.exists = (key) =>
	{
		return key in stock;
	};
	
	db.save = () =>
	{

	};

	db.load = () =>
	{
		let listFiles = lib.fs.readdirSync (db.path, "utf8");
		for (let id in listFiles)
		{
			let file = listFiles [id];
			let path = db.path + "/" + file;
			let raw = lib.fs.readFileSync (path);

			let entry = file.split ('.');
			let key = entry[0];
			let type = entry[1];
			stock [entry] = raw.toString();
		}
	};

	db.load ();

	return db;
}

module.exports = database;