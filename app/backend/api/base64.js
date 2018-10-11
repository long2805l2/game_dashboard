const trueBase = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const trueTable = trueBase.split("");
const fakeBase = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
const fakeTable = fakeBase.split("");
const shuffleSeed = require('shuffle-seed');

function base64 (seed = null)
{
	if (seed == null || typeof (seed) !== "string")
		seed = "";

	const table = shuffleSeed.shuffle(fakeTable, seed);
	const padding = "=";

	var mappingEncode = {};
	var mappingDecode = {};
	for (let i = 0; i < 64; i++)
	{
		let characterEncode = trueTable[i];
		let characterDecode = table[i];
		mappingEncode [characterEncode] = characterDecode;
		mappingDecode [characterDecode] = characterEncode;
	}
	
	const btoa = (string) => 
	{
		let temp = new Buffer(string).toString('base64');
		let base64 = [];

		for (let i = 0; i < temp.length; i++)
			if (!temp.charAt (i))
				break;
			else
				base64 [i] = mappingEncode [temp.charAt (i)];
		
		return base64.join("");
	};

	const atob = (strb64) =>
	{
		var temp = [];
		for (let i = 0; i < strb64.length; i++)
			if (!strb64.charAt (i))
				break;
			else
				temp [i] = mappingDecode [strb64.charAt (i)];
		
		return new Buffer(temp.join(""), 'base64').toString('utf-8');
	};

	return {
		encode: btoa,
		decode: atob
	};
}

module.exports = base64;