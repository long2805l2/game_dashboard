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
		hash: ""
	};
	var stock = {};

	const salt = lib.cryptoJS.SHA256(absolutePath).toString();
	const base64 = lib.base64 (salt);
	const encode = (value) => value;//base64.encode (value);
	const decode = (value) => value;//base64.decode (value);
	const encrypt = (value) => value;//lib.cryptoJS.AES.encrypt(value, salt).toString().replace (/\//g, "-");
	const decrypt = (value) => value;//lib.cryptoJS.AES.decrypt(value.replace (/-/g, "/"), salt).toString(lib.cryptoJS.enc.Utf8);

	const writeFile = (key, value) => lib.fs.writeFileSync (db.path + "/" + encode(key), encrypt(value), "utf8");
	const writeRaw = (key, value) => stock [key] = value;
	
	db.write = (key, value) =>
	{
		let temp = value;
		let type = typeof (value);
		if (type === "object")
			temp = JSON.stringify (value);
		
		writeFile (key + "." + type, temp);
		writeRaw (key, value);
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

	var load = () =>
	{
		try
		{
			let listFiles = lib.fs.readdirSync (db.path, "utf8");
			for (let id in listFiles)
			{
				let file = listFiles [id];
				let path = db.path + "/" + file;
				let raw = lib.fs.readFileSync (path);

				let keyParts = decode (file);
				keyParts = keyParts.split (".");
				let key = keyParts [0];
				let type = keyParts [1];

				let value = decrypt (raw.toString());
				switch (type)
				{
					case "number": value = Number (value); break;
					case "boolean": value = Boolean (value); break;
					case "object": value = JSON.parse (value); break;
				}
				
				writeRaw (key, value);
			}
		}
		catch (error)
		{
			console.log (error);
		}
	};

	load ();

	return db;
}

module.exports = database;