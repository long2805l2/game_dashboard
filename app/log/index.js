const fs = require ("fs");
const os = require ("os");
var CronJob = require('cron').CronJob;
var config = require("../../config.js");
var watcher = require ("./api/watcher.js");
var parser = require ("./api/parser.js");
var report = require ("./report/manager.js");
var debug = require ("./api/debug.js");

let private = {};
private.client = require('./api/client.js')();
private.LOGS = require ("./design.js");
private.watchers = [];
private.jobs = [];
private.debug = null;

private.init = async function ()
{
	private.debug = debug (config.log.debug);
	private.client.connect ();
	// await private.client.clean ();
	// await private.client.createTemplate (private.LOGS, private.debug);
	private.client.createQueue ();
	
	for (let catalog in private.LOGS)
	{
		let log = private.LOGS [catalog];
		for (let id in log)
		{
			let design = log[id];
			let dir = config.log.raw + "/" + id;
			let p = parser (catalog, id, design, "\n", "\t");

			if (!fs.existsSync(dir))
				fs.mkdirSync(dir);
			
			let w = watcher();
			w.init (dir, config.log.cache, p, private.client, private.debug);

			private.watchers.push (w);
		}
	}

	private.jobs = [
		{id: 0, onRun: false, time: "0 */1 * * * *", task: () => private.job_import()}
	,	{id: 2, onRun: false, time: "0 15 * * * *", task: () => private.job_analyst ("hour")}
	,	{id: 3, onRun: false, time: "0 0 1 * * *", task: () => private.job_analyst ("day")}
	,	{id: 4, onRun: false, time: "0 25 1 * * 1", task: () => private.job_analyst ("week")}
	,	{id: 5, onRun: false, time: "0 35 1 1 * *", task: () => private.job_analyst ("month")}
	,	{id: 6, onRun: false, time: "0 45 1 1 * *", task: () => private.job_analyst ("year")}
	];

	for (let i in private.jobs)
	{
		let job = private.jobs [i];
		job.run = new CronJob (job.time, () =>
		{
			if (job.onRun)
				return;

			job.onRun = true;
			job.task ();
			job.onRun = false;
		});
	}
};

private.start = function ()
{
	private.client.start ();
	report.init (private.client);
	// for (let i in private.jobs)
	// 	private.jobs [i].run.start ();
	// private.job_import();
	private.job_analyst ("hour");
};

private.job_import = function ()
{
	for (let i in private.watchers)
		private.watchers [i].start ();
};

private.job_analyst = function (group)
{
	console.log (Date.now(), "job_analyst", group);
	
	report.run(group);
};

private.init ();
private.start ();