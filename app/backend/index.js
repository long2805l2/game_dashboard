const cors = require('cors');
const CryptoJS = require('crypto-js');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');

const config = require ('../../config.js');
const admin = require ("./api/admin.js");
const database = require ('./api/database.js');

const db = 
{
	admin: database (config.database.admin)
};

const adminControl = admin (db.admin, config.authen.publickey, config.authen.privatekey, config.authen.method);

const app = express();
app.use(bodyParser.json());
app.use("/static", express.static ("../static/public"));
app.use(cors({origin: config.frontend.home}));

var server = http.createServer(app);
server.listen(config.backend.port, () => console.log ("start at: " + config.backend.home));

app.route('/login').post((request, response) =>
{
	let body = request.body;
	if (!body)
	{
		response.status(200).json({error: "cannot parse body"}).end();
		return;
	}

	let domain = body.domain;
	let password = body.password;
	let result = adminControl.login (domain, password);
	response.status(200).json(result).end();
});

app.route('/logout').post((request, response) =>
{
	let body = request.body;
	if (!body)
	{
		response.status(200).json({error: "cannot parse body"}).end();
		return;
	}

	let domain = body.domain;
	let token = body.token;
	let result = adminControl.logout (domain, token);
	response.status(200).json(result).end();
});

app.route('/api/admin').post(getAdminList);
function getAdminList (request, response)
{
	let body = request.body;
	if (!body)
	{
		response.status(200).json({error: "cannot parse body"}).end();
		return;
	}

	let domain = body.domain;
	let token = body.token;
	let data = body.data;
	let cmd = body.cmd;
	let result = adminControl.call (domain, token, "admin." + cmd, data);
	response.status(200).json(result).end();
}

app.route ('/api/player').post (sendPlayerRequest);
function sendPlayerRequest (request, response)
{
	let body = request.body;
	let domain = body.domain;
	let token = body.token;
	let url = "/" + body.cmd;

	console.log ("body:" + JSON.stringify(body));
	let check = adminControl.check (domain, token, "player_" + body.cmd);
	if (check.error)
	{
		response.status(200).json(check).end();
		return;
	}

	let obj = {
		admin: domain
	,	data: body.data
	,	time: new Date().getTime()
	};
	
	let inputHash = config.gm.key + obj.admin + obj.time + JSON.stringify(obj.data);
	let method = CryptoJS[config.gm.method];
	obj.hash = method(inputHash).toString(CryptoJS.enc.Hex);

	let sendData = JSON.stringify(obj);
	let isDownload = obj.data ["useFile"];
	let post_options = {
		host: config.gm.ip
	,	port: config.gm.port
	,	path: url
	,	method: 'POST'
	,	headers: {
			'Content-Type': 'text/plain; charset=UTF-8'
		,	'Content-Length': Buffer.byteLength(sendData)
		}
	};

	let callback = null;
	if (isDownload)
		callback = (res) => {
			let fileName = (new Date()).getTime() + ".zip";
			let file = fs.createWriteStream("../static/" + fileName);
			res.on('data', (chunk) => file.write(chunk));
			res.on('end', () => {
				file.end();
				response.status(res.statusCode).json ({
					result: "success"
				,	file: "static/" + fileName
				});
			});
		};
	else
		callback = (res) => {
			let data = [];
			res.on('data', (chunk) => data.push(chunk));
			res.on('end', () => {
				let buffer = Buffer.concat(data);
				response.status(res.statusCode).json(JSON.parse(buffer.toString()));
			});
		};

	let post_req = http.request (post_options, callback);
	post_req.write(sendData);
	post_req.end();
}