const fs = require ("fs");
const os = require ("os");
const elasticsearch = require('elasticsearch');

function client ()
{
	let elastic = null;
	
	let queue = [];
	
	// const queue = "../static/private/log/queue";
	// var queueStream = fs.createWriteStream(queue);

	let private = {};
	private.interval = null;
	private.intervalMs = 1;
	private.timeoutMs = 800;
	private.isReady = false;
	private.lock = false;
	private.threads = 4;

	let public = {};

	private.start = () =>
	{
		if (private.interval === null)
			clearInterval(private.interval);

		private.interval = setInterval(private.update, private.intervalMs);
		// private.update();
	};

	private.update = () =>
	{
		// process.nextTick (private.update);

		if (!private.isReady)
			return;

		if (private.lock)
			return;

		if (queue.length === 0)
			return;
			
		let obj = queue.pop();
		private.addDocument (obj);
	};

	private.check = () =>
	{
		return elastic.ping({requestTimeout: 30000});
	};

	private.clean = () =>
	{
		return elastic.indices.delete({index: "_all"});
	};

	private.hasIndex = (index) =>
	{
		return elastic.indices.exists({index: index});
	};

	private.addIndex = (index) =>
	{
		return elastic.indices.create({index: index});
	};

	private.removeIndex = (index) =>
	{
		return elastic.indices.delete({index: index});
	};

	private.addDocument = async (document) =>
	{
		private.lock = true;
		elastic.index(document
		,	(err, resp, status) =>
		{
			if (err)
			{
				console.log (err);
				public.push (document);
				return;
			}
		});
		private.lock = false;
	};

	private.removeDocument = (documentId) =>
	{
		return elastic.delete(documentId);
	};

	private.getMapping = (index, type) =>
	{
		return elastic.indices.getMapping({
			index: index
		,	type: type
		});
	}

	private.addMapping = (index, type, properties) =>
	{
		return elastic.indices.putMapping({
			index: index
		,	type: type
		,	body: {
				properties: properties
			}
		});
	}

	public.search = (query) =>
	{
		return elastic.search (query);
	};

	public.connect = () =>
	{
		elastic = new elasticsearch.Client({
			host: 'localhost:9200'
		});
	}

	public.init = async(LOGS) =>
	{
		let result = await private.clean ();
		console.log ("clean", JSON.stringify(result));
		
		for (let catalog in LOGS)
		{
			result = await private.addIndex (catalog);
			console.log ("addIndex", JSON.stringify(result));
			
			let log = LOGS [catalog];
			let properties = {};
			for (let id in log)
			{
				let design = log[id];
				for (let fid in design)
				{
					let field = design [fid];
					let type = "text";
					let t = field.charAt (0);
	
					switch (t)
					{
						case 't':						break;
						case 'i':	type = "long";		break;
						case 's':						break;
						case 'b':	type = "boolean";	break;
						default:						break;
					}
	
					properties [field] = {
						type: type
					};
				}
			}
			
			result = await private.addMapping (catalog, "doc", properties);
			console.log ("addMapping", JSON.stringify(result));
		}

		private.isReady = true;
		private.start();
	};

	public.push = (obj) =>
	{
		// queueStream.write(JSON.stringify (obj) + os.EOL);
		queue.push (obj);
	};

	return public;
}

module.exports = client;