const fs = require ('fs');
const os = require('os');
const crypto = require('crypto');

const status_stop = "stop";
const status_init = "init";
const status_wait = "wait";
const status_resume = "resume";
const status_run = "run";
const break_line = os.EOL;// /(\r\n)|(\n)/g;

function watcher ()
{
	var private = {};

	private.watchDir = "";
	private.except = /.*_current/;
	private.cacheDir = "";
	private.error = "";
	private.fileEncode = "utf8";
	private.status = status_stop;
	private.ready = false;
	private.files = {};
	private.parser = null;
	private.elastic = null;
	private.thread = null;
	private.debugLog = null;

	private.init = function ()
	{
		try
		{
			private.files = {};

			let caches = fs.readdirSync (private.cacheDir);
			for (let i = 0; i < caches.length; i++)
			{
				let filePath = private.cacheDir + "/" + caches [i];
				let json = fs.readFileSync (filePath);
				let file = JSON.parse (json);
				if (file.dir !== private.watchDir)
					continue;

				file.lock = false;
				private.files [file.name] = file;
			}
			
			let files = fs.readdirSync (private.watchDir);
			for (let i = 0; i < files.length; i++)
			{
				let fileName = files [i];
				
				if (fileName.match (private.except))
					continue;

				if (private.files [fileName])
					continue;
				
				private.addFile (fileName);
			}
			
			private.status = status_wait;
			return true;
		}
		catch (error)
		{
			private.error = error;
			console.log ("watcher", "init", error);
			return false;
		}
	};

	private.resume = function ()
	{
		try
		{
			for (let id in private.files)
			{
				// console.log ("private.resume", id);
				let file = private.files [id];
				private.updateFile (file);
			}
			
			private.status = status_run;
			return true;
		}
		catch (error)
		{
			private.error = error;
			console.log ("watcher", "resume", error);
			return false;
		}
	}

	private.cache = function (file)
	{
		// cache is the file, who save last line watcher ready parse
		// fs.writeFileSync(private.cacheDir + "/" + file.cache, JSON.stringify (file));
	};

	private.readLines = function (err, bytesRead, buffer, file)
	{
		if (err)
		{
			console.log (err);
			return;
		}
		
		let fd = file.fd;
		file.fd = -1;

		let lines = buffer.toString(private.fileEncode, 0, bytesRead);

		// console.log ("private.readLines", "private.parser", private.parser ? "not null" : "null");
		if (private.parser)
		{
			let objs = private.parser.parse (file.dir, file.name, lines);
			// console.log ("private.readLines", "objs", objs ? objs.length : "null");
			if (objs && objs.length > 0)
			{
				// while (objs.length > 200)
				// {
				// 	let temp = objs.splice(0, 200);
				// 	private.elastic.push (temp);
				// }

				// if (objs.length > 0)
					private.elastic.push (objs);
			}
		}

		file.last += bytesRead;
		private.cache (file);
		fs.close(fd, (err) => 
		{
			if (err)
			{
				console.log (err);
				return;
			}

			file.lock = false;
			file.lastRead = Date.now();
		});
	};

	private.openToRead = function (err, fd, file, target)
	{
		if (err)
		{
			console.log (err);
			return;
		}

		let size = target - file.last;
		let buffer = new Buffer(size);
		file.fd = fd;

		fs.read(fd, buffer, 0, size, file.last, (err2, bytesRead, buffer) => private.readLines (err2, bytesRead, buffer, file));
	};

	private.addFile = function (fileName)
	{
		let path = private.watchDir + "/" + fileName;
		private.files [fileName] = {
			dir: private.watchDir
		,	name: fileName
		,	path: path
		,	cache: crypto.createHash('md5').update(path).digest("hex")
		,	last: 0
		,	fd: -1
		,	lock: false
		};
	}

	private.updateFile = function (file)
	{
		let stat = fs.statSync (file.path);
		
		if (file.last < stat.size && !file.lock)
		{
			file.lock = true;
			fs.open(file.path, 'r', (err, fd) => private.openToRead(err, fd, file, stat.size));
		}
	}

	private.watchFile = function (event, fileName)
	{
		if (fileName.match (private.except))
		{
			console.log ("watcher", "skip file", fileName);
			return;
		}
		else
			console.log ("watcher", fileName);

		let stats = fs.statSync(private.watchDir + "/" + fileName);
		if (stats.isDirectory())
			return;

		if (!private.files [fileName])
			private.addFile (fileName);
		
		let file = private.files [fileName];
		private.updateFile (file);
	};

	var public = {};
	public.init = (wacthDirPath, cacheDirPath, parser, elastic, debugLog) =>
	{
		private.watchDir = wacthDirPath;
		private.cacheDir = cacheDirPath;
		private.parser = parser;
		private.elastic = elastic;
		private.debugStream = debugLog;
		private.init ();
		private.ready = true;
	};

	public.start = () =>
	{
		// if (!private.error)
		// {	
			// private.thread = fs.watch(private.watchDir, (event, fileName) => private.watchFile(event, fileName));
			private.resume ();
		// }
		// else
		// 	console.log (private.error);
	}

	public.stop = () =>
	{
		// if (private.status !== status_run)
		// 	return;

		// private.thread.close();
		// for (let id in private.files)
		// {
		// 	let file = private.files [id];

		// 	fs.unwatchFile (file.path);
		// 	private.cache (file);
		// }
	}

	return public;
}

module.exports = watcher;