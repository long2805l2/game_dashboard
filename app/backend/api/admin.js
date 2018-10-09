const lib = require('./lib.js');
const keyPass = "_password";
const keyPermission = "_permission";
const expiresDefault = 5 * 60;

function admin (db, publicKeyPath, privateKeyPath, method)
{
	var admin = {};
	var online = {};
	var publicKey = lib.fs.readFileSync (publicKeyPath).toString();
	var privateKey = lib.fs.readFileSync (privateKeyPath).toString();

	var sign = (domain, payload) =>
	{
		var signOptions = {
            subject: domain,
			expiresIn: expiresDefault + "s",
			algorithm: method
		};
		return lib.jsonwebtoken.sign(payload, privateKey, signOptions);
	};

	var verify = (domain, token) =>
	{   
		var verifyOptions = {
            subject: domain,
			expiresIn: "1m",
			algorithm: [method]
		};
		try
		{
			let decode = lib.jsonwebtoken.verify(token, publicKey, verifyOptions);
			return decode;
		}
		catch (err)
		{
			console.log ("error", domain, JSON.stringify(err));
			return false;
		}
	};

	var init = () =>
	{
		if (!db.exists ("superadmin"))
		{
			db.write ("superadmin" + keyPass, "root");
			db.write ("superadmin" + keyPermission, JSON.stringify({
				"admin_password": true
			,	"admin_permissions": true
			,	"admin_list": true
			,	"admin_add": true
			,	"admin_remove": true
			,	"admin_permission": true
			,	"player_getUserData": true
			}));
		}

		let onlineTemp = db.read ("online");
		if (onlineTemp !== undefined && onlineTemp !== "")
		{
			onlineTemp = JSON.parse (onlineTemp);
			let domains = Object.keys(onlineTemp);
			for (let id = 0; id < domains.length; id++)
			{
				let domain = domains [id];
				let detail = onlineTemp [domain];
				let check = verify (domain, detail.token);
				
				if (check)
					online[domain] = detail;
			}
			db.write ("online", JSON.stringify(online));
		}
	};

	admin.login = (domain, password) =>
	{
		let curPass = db.read (domain + keyPass);
		if (curPass !== password)
			return {error: "wrong domain or password"};

		if (online [domain])
			admin.logout (domain);

		let payload = {};
		let token = sign (domain, payload);
		
		let p = db.read (domain + keyPermission);
		if (p === "" || p === undefined || p === null)
			p = {};
		else
			p = JSON.parse (p);
		
		online [domain] = {
			token: token,
			permission: p
		};

		db.write ("online", JSON.stringify (online));

		return {
			msg: "wellcome back, " + domain,
			payload: payload,
			token: token,
			expiresIn: expiresDefault
		};
	};

	admin.logout = (domain) =>
	{
		if (domain in online)
		{
			delete online [domain];
			db.write ("online", JSON.stringify (online));
			return {msg: "goodbye"};
		}

		return {error: "cannot logout"};
	};

	admin.password = (domain, token, newPass) =>
	{
		if (!online[domain] || online[domain].token !== token)
			return {error: "relogin or check your information"};
		
		db.write (domain + keyPass, newPass);
	};

	admin.check = (domain, token, cmd) =>
	{
		if (!online[domain] || online[domain].token !== token)
			return {error: "relogin or check your information"};

		let p = online[domain].permission;
		if (p[cmd] === true)
			return {msg: "it's ok"};

		return {error: "you don't have permission: " + cmd};
	};
	
	admin.list = (domain, token) =>
	{
		return ["longph", "thuanvt"];
	};
	
	admin.add = (domain, token, who) =>
	{
		
	};

	admin.remove = (domain, token, who) =>
	{
		
	};

	admin.permission = (domain, token, cmd, giveTo, value) =>
	{
		let check = admin.check (domain, token, "admin/premission");
		if (check ["error"])
			return check.error;

		if (!db.exists (giveTo))
			return {error: giveTo + " need add to admin list first"};

		if (online [giveTo])
		{
			online [giveTo].permission [cmd] = value;
			db.write (giveTo + keyPermission, online [giveTo].permission);
		}
		else
		{
			let p = db.read (giveTo + keyPermission);
			if (p === "" || p === undefined || p === null)
				p = {};
			else
				p = JSON.parse (p);

			p [cmd] = value;
			db.write (giveTo + keyPermission, p);
		}
		
		return {msg: "I'm done!"};
	};
	
	admin.permissions = (domain, token, who) =>
	{
		
	};

	init ();
	return admin;
}

module.exports = admin;
