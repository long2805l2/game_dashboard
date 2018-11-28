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

			obj [field] = private.convert (field, raw);
		}

		obj ["src"] = private.type;

		return obj;
	};

	private.convert = (field, raw) =>
	{
		let type = field.charAt(0);
		let value = raw;

		switch (type)
		{
			case 't':							break;
			case 'a':	value = raw.split(",");	break;
			case 'm':	value = {}
						let temp = raw.split(",");
						for (let i in temp)
						{
							let p = temp [i];
							if (p === "")
								continue;

							p = p.split (":");
							value [p[0]] = p[1];
						}
						break;
			case 'i':	value = Number (raw);	break;
			case 's':							break;
			case 'b':	value = Boolean (raw);	break;
			default:							break;
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