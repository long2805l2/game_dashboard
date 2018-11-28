const fs = require ("fs");
const os = require ("os");
const elasticsearch = require('elasticsearch');

const config = require("../../../config.js");

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
	private.debugLog = null;

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

	private.addTemplate = (index, properties) =>
	{
		return elastic.indices.putTemplate ({
			order: 0
		,	create: false
		,	name: index + "_template"
		,	body: {
				index_patterns: index + "*"
			,	settings: { number_of_shards: 1 }
			,	mappings: {
					doc: {
						_source: {
							enabled: true
						}
					,	properties: properties
					}
				}
			}
		});
	};

	private.addDocument = async (document) =>
	{
		private.lock = true;
		elastic.index(document
		,	(err, resp, status) =>
		{
			private.lock = false;
			if (err)
			{
				private.debugLog.log ("elastic", "addDocument", "error", JSON.stringify (document));
				public.push (document);
				return;
			}
		});
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

	public.search = (index, query) =>
	{
		return elastic.search ({
			index: index
		,	type: "doc"
		,	body: query
		});
	};

	public.connect = () =>
	{
		elastic = new elasticsearch.Client({
			host: config.elastic.home
		});
	}

	public.init = async(LOGS, debugLog) =>
	{
		private.debugLog = debugLog;

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
					let t = field.charAt (0);
					let rule = {};
	
					switch (t)
					{
						case 't':
							rule.type = "date";
							rule.format = "yyyy-MM-dd HH:mm:ss";
							break;

						case 'a':
							// rule.type = "array";
							break;

						case 'm':
							// rule.type = "array";
							break;

						case 'i':
							rule.type = "long";
							break;
						
						case 's':
							rule.type = "text";
							rule.fielddata =true;
							break;

						case 'b':
							rule.type = "boolean";
							break;

						default:
							break;
					}
	
					if ("type" in rule)
						properties [field] = rule;
				}
			}

			properties ["src"] = {
				type: "text"
			,	fielddata: true
			}
			
			result = await private.addTemplate (catalog, properties);
			console.log ("addTemplate", JSON.stringify(result));
		}

		private.isReady = true;
		private.start();
	};

	public.push = (obj) =>
	{
		queue.push (obj);
		private.debugLog.log ("elastic", "public.push", JSON.stringify (obj));
	};

	public.forcePush  = (obj) =>
	{
		private.addDocument (obj);
	};

	return public;
}

module.exports = client;