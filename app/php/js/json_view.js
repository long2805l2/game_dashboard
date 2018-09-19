String.space = function(a)
{
	var b = [];
	var e;

	for (e = 0; e < a; e++)
		b.push("\t");
	
    return b.join("")
};

function json_format (json_text)
{
	var b = json_text.replace(/\n/g, " ").replace(/\r/g, " ");
	var e = [];
	var c = 0;
	var d = !1;
	var i = b.length;

	for (var f = 0; f < i; f++)
	{
		var g = b.charAt(f);
		if (d && g === d) b.charAt(f - 1) !== "\\" && (d = !1);
		else if (!d && (g === '"' || g === "'")) d = g;
		else if (!d && (g === " " || g === "\t")) g = "";
		else if (!d && (g === ":")) g += " ";
		else if (!d && (g === ",")) g += "\n" + String.space(c);
		else if (!d && (g === "[" || g === "{")) c++, g += "\n" + String.space(c);
		else if (!d && (g === "]" || g === "}")) c--, g = "\n" + String.space(c) + g;
		e.push(g);
	}
	
	return e.join("");
}

function json_html (json_text)
{
	var json = JSON.parse (json_text);
	var html = "";

	var queue = [["json", json]];
	while (queue.length > 0)
	{
		var current = queue.pop();
		if (!Array.isArray (current))
		{
			html += current;
			continue;
		}

		var key = current [0];
		var obj = current [1];
		var type = typeof obj;
		if (type === "object")
		{
			if (Array.isArray (obj))
				type = "array";
		}

		switch (type)
		{
			case "number":
			case "boolean":
			case "string":
				html += "<li><label class='key'>" + key + "</label><span class='" + type + "'>" + obj + "</span></li>";
				break;
			
			case "object":
			case "array":
				var temp = [];
				for (var property in obj)
					temp.push ([property, obj[property]]);
				
				if (temp.length == 0)
				{
					html += "<li><label class='key'>" + key + "</label><span class='" + type + "'>";
					html += type === "array" ? "[]" : "{}";
					html += "</span></li>";
				}
				else
				{
					html += "<li><label class='key'>" + key + "</label><ul class='" + type + "' onclick='onShow(this)'>";
					queue.push ("</ul></li>");
					
					while (temp.length > 0)
						queue.push (temp.pop());
				}
				break;
			
			default:
			break;
		}
	}
	return html;
}

function onHide (element)
{
	console.log ("onHide");
	console.log (element);
}

function onShow (element)
{
	console.log ("onShow");
	console.log (element);
}