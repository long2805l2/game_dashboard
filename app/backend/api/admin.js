const lib = require('./lib.js');
const keyPass = "_password";
const keyPermission = "_permission";
const expiresDefault = 60 * 60;

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
			db.write ("list", ["superadmin"]);
			db.write ("superadmin" + keyPass, "root");
			db.write ("superadmin" + keyPermission, {
				admin_password: true
			,	admin_permissions: true
			,	admin_list: true
			,	admin_add: true
			,	admin_remove: true
			,	admin_permission: true
			,	player_getUserData: true
			});
		}

		let onlineTemp = db.read ("online");
		if (onlineTemp)
		{
			let domains = Object.keys(onlineTemp);
			for (let id = 0; id < domains.length; id++)
			{
				let domain = domains [id];
				let detail = onlineTemp [domain];
				let check = verify (domain, detail.token);
				
				if (check)
					online[domain] = detail;
			}
			db.write ("online", online);
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
		
		online [domain] = {
			token: token,
			permissions: p
		};

		db.write ("online", online);

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
			db.write ("online", online);
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
		{
			return {error: "relogin or check your information"};
		}

		let p = online[domain].permissions;
		if (p[cmd] === true)
			return {msg: "it's ok"};

		return {error: "you don't have permission: " + cmd, online: online};
	};

	admin.isAdmin = (domain) =>
	{
		let list = db.read ("list");
		list = list;
		let index = list.indexOf (domain);

		return index > -1;
	};
	
	admin.list = (domain, token, requireData) =>
	{
		let check = admin.check (domain, token, "admin_list");
		if (check ["error"])
			return check;

		let allDomains = db.read ("list");
		return {msg: "I'm done!", list: allDomains};
	};
	
	admin.add = (domain, token, requireData) =>
	{
		let check = admin.check (domain, token, "admin_add");
		if (check ["error"])
			return check;

		let target = requireData.target;

		db.write (target + keyPass, "root");
		db.write (target + keyPermission, {
			"admin_password": true
		,	"admin_permissions": true
		});

		let list = db.read ("list");
		list.push (target);
		db.write ("list", list);
		
		return {msg: "I'm done!", target: target};
	};

	admin.remove = (domain, token, requireData) =>
	{
		let check = admin.check (domain, token, "admin_remove");
		if (check ["error"])
			return check;

		let target = requireData.target;
		db.remove (target + keyPass);
		db.remove (target + keyPermission);
		
		let list = db.read ("list");
		let index = list.indexOf (target);
		if (index != -1)
			list.splice (index, 1);
		db.write ("list", list);

		return {msg: "I'm done!"};
	};

	admin.permission = (domain, token, requireData) =>
	{
		let check = admin.check (domain, token, "admin_permission");
		if (check ["error"])
			return check;
		
		let cmd = requireData.cmd;
		let target = requireData.target;
		let value = requireData.value;
		let p = {};
		
		if (!admin.isAdmin (target))
			return {error: target + " need add to admin list first"};

		if (online [target])
		{
			online [target].permission [cmd] = value;
			p = online [target];
		}
		else
		{
			p = db.read (target + keyPermission);
			if (p === "" || p === undefined || p === null)
				p = {};

			p [cmd] = value;
		}

		db.write (target + keyPermission, p);
		
		return {msg: "I'm done!", target: target, permissions: p};
	};
	
	admin.permissions = (domain, token, requireData) =>
	{
		let check = admin.check (domain, token, "admin_permissions");
		if (check ["error"])
			return check;
		
		let target = requireData.target;
		let p = db.read (target + keyPermission);
		
		return {msg: "I'm done!", target: target, permissions: p};
	};

	init ();
	return admin;
}

module.exports = admin;
