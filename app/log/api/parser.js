const crypto = require('crypto');

var count = 0;

function parser (index, type, fields, breakFileChar, breakLineChar)
{
	let private = {};
	private.index = index;
	private.type = type;
	private.fields = fields;
	private.breakFileChar = breakFileChar;
	private.breakLineChar = breakLineChar;

	private.breakFile = (str) =>
	{
		let temp = str.split (private.breakFileChar);
		let objs = [];
		for (let i in temp)
		{
			if (temp [i].length === 0)
				continue;

			let line = temp [i];
			let obj = {
				index: private.index
			,	id: crypto.createHash('md5').update(line).digest("hex")
			,	type: "doc"//private.type
			,	body: private.breakLine (line)
			};

			if ("timestamp" in obj.body)
			{
				let date = obj.body["timestamp"].split (" ")[0];
				date = date.replace(/(20)/, "").replace (/(-)/g, "");
				obj.index += "_" + date;
			}

			objs.push (obj);
		}
		
		return objs;
	};
	
	private.breakLine = (line) =>
	{
		let temp = line.split (private.breakLineChar);
		let obj = {};
		for (let i = 0; i < temp.length; i++)
		{
			let field = private.fields [i];
			let raw = temp [i];
			if (raw === "")
				continue;

			if (!field || field.length == 0)
				field = "smf" + i;

			let v = private.convert (field, raw);
			if (v === undefined)
				obj [field + "_error"] = raw;
			else if (typeof (v) === "object")
				for (let p in v)
					obj [field + "_" + p] = v [p];
			else
				obj [field] = v;
		}

		obj ["src"] = private.type;

		return obj;
	};

	private.convert = (field, str) =>
	{
		let type = field.charAt(0);
		let value = str;

		switch (type)
		{
			case 't':										break;
			case 'a':	value = private.parseArray (str);	break;
			case 'm':	value = private.parseMap (str);		break;
			case 'i':	value = private.parseNum (str);		break;
			case 's':										break;
			case 'b':	value = private.parseBool (str);	break;
			default:										break;
		}
		
		return value;
	};
	
	private.parseNum = (str) =>
	{
		let v = Number (str);
		if (v === NaN)
			return undefined;

		return v;
	};

	private.parseBool = (str) =>
	{
		let v = str.toLowerCase ();
		if (v === "true")
			return true;

		if (v === "false")
			return false;
		
		return undefined;
	};

	private.parseArray = (str) =>
	{
		let value = [];
		let temp =  str.split(",");
		for (let i in temp)
		{
			if (isNaN (temp[i]))
				value.push (temp[i]);
			else
				value.push (Number (p[1]));
		}
		return value;
	};
	
	private.parseMap = (str) =>
	{
		let value = {};
		let temp = str.split(",");
		for (let i in temp)
		{
			let p = temp [i];
			if (p === "")
				continue;

			p = p.split (":");
			if (p.length != 2)
				return undefined;

			if (isNaN (p[1]))
				value [p[0]] = p[1];
			else
				value [p[0]] = Number (p[1]);
		}

		return value;
	};

	let public = {};
	public.parse = (dir, file, newStr) =>
	{
		let objs = private.breakFile (newStr);
		return objs;
	};

	return public;
}

module.exports = parser;