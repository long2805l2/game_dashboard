const express = require('express');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ldap = require('ldapjs');
const CryptoJS = require('crypto-js');

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

const admin_authen = require ("./api/admin_authen");
const authen = new admin_authen ('../private/public.key', '../private/private.key', 'RS256');
const http = require('http');

const ADMIN_KEY = "(@dm1nS#cr3tKey!)";

var server = http.createServer(app);
var io = require('socket.io')(server);

server.listen(4201, () => console.log ("http://localhost:4201"));

app.route('/api/admin/authen').post((request, response) =>
{
	let domain = request.body.domain;
	let password = request.body.password;

	let json = authen.login (domain, password);
	if (!json)
	{
		response.status(401).send("Check your domain or password!");
		return;
	}

	response.status(200).json(json);
});

app.route('/api/admin/list').post(getAdminList);
function getAdminList (request, response)
{
	let domain = request.body.domain;
	let token = request.body.token;
	let json = authen.verify (domain, token);
	if (!json)
	{
		response.status(403).send("You must login fisrt!");
		return;
	}

	response.status(200).json(["longph", "thuanvt"]);
}

app.route ('/api/player').post (sendPlayerRequest);
function sendPlayerRequest (request, response)
{
	let body = request.body;
	let url = "/" + body.cmd;

	let obj = {
		admin: "longph"
	,	data: body.data
	,	time: new Date().getTime()
	};
	
	let inputHash = ADMIN_KEY + obj.admin + obj.time + JSON.stringify(obj.data);
	obj.hash = CryptoJS.SHA256(inputHash).toString(CryptoJS.enc.Hex);

	let sendData = JSON.stringify(obj);

	let post_options = {
		host: '49.213.72.182'
	,	port: '8010'
	,	path: url
	,	method: 'POST'
	,	headers: {
			'Content-Type': 'text/plain; charset=UTF-8'
		,	'Content-Length': Buffer.byteLength(sendData)
		}
	};

	let callback = (res) => {
		let data = "";
		res.setEncoding('utf8');
		res.on('data', (chunk) => data += chunk);
		res.on('end', () => response.status(res.statusCode).json(JSON.parse(data)));
	};

	let post_req = http.request (post_options, callback);
	post_req.write(sendData);
	post_req.end();
}