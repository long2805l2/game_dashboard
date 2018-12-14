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
			
		let obj = queue.shift();
		if (Array.isArray(obj))
			private.addDocuments (obj);
		else
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

	private.addTemplate = (index, param) =>
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
					,	dynamic_templates: param.dynamic_templates
					,	dynamic: true
					,	properties: param.properties
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

	private.addDocuments = async (documents) =>
	{
		let body = [];
		private.lock = true;
		for (let i = 0; i < documents.length; i++)
		{
			let base = documents [i];
			let cmd = { index:  { _index: base.index, _type: base.type, _id: base.id } };
			let doc = base.body;
			
			body.push (cmd);
			body.push (doc);
		}

		private.bulk (body, (error, resp) =>
		{
			private.lock = false;
			if (error)
			{
				private.debugLog.log ("elastic", "addDocuments", "error", JSON.stringify (error));
				public.push (documents);
			}
		});
	}

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
	};

	private.bulk = async (body, callback) =>
	{
		elastic.bulk(
			{body: body}
		,	(err, resp) =>
			{
				if (callback)
					callback (err, resp);
			}
		);
	};

	public.search = function (index, query, filter_path = "")
	{
		return elastic.search ({
			index: index
		,	filter_path: filter_path
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
			let dynamic_templates = {};
			for (let id in log)
			{
				let design = log[id];
				for (let fid in design)
				{
					let field = design [fid];
					let t = field.charAt (0);
					let rule = {};
					let childs = null;
	
					switch (t)
					{
						case 't':
							rule.type = "date";
							rule.format = "yyyy-MM-dd HH:mm:ss";
							break;

						case 'a':
						case 'm':
							// childs = {};
							// childs [field + "_number"] = {
							// 	path_match: field + "_*"
							// ,	match_mapping_type: "long"
							// ,	mapping: { type: "long" }
							// };
							// childs [field + "_boolean"] = {
							// 	path_match: field + "_*"
							// ,	match_mapping_type: "boolean"
							// ,	mapping: { type: "boolean"}
							// };
							// childs [field + "_text"] = {
							// 	path_match: field + "_*"
							// ,	match_mapping_type: "string"
							// ,	mapping: { type: "text"}
							// };

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

					if (childs)
						for (let i in childs)
							dynamic_templates [i] = childs [i];
				}
			}

			properties ["src"] = {
				type: "text"
			,	fielddata: true
			};

			let temp = [];
			for (let i in dynamic_templates)
			{
				let d = {};
				d [i] = dynamic_templates [i];
				temp.push (d);
			}

			let param = {
				properties: properties
			,	dynamic_templates: temp
			};
			
			result = await private.addTemplate (catalog, param);
			console.log ("addTemplate", JSON.stringify(result));
		}

		private.isReady = true;
		private.start();
	};

	public.push = (obj) =>
	{
		queue.push (obj);
		
		// private.debugLog.log ("elastic", "public.push", JSON.stringify (obj));
	};

	public.forcePush = (obj) =>
	{
		private.addDocument (obj);
	};

	return public;
}

module.exports = client;