const express = require('express');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ldap = require('ldapjs');

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(4201, () => console.log ("http://localhost:4201"));

const admin_authen = require ("./api/admin_authen");
const authen = new admin_authen ('../private/public.key', '../private/private.key', 'RS256');

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