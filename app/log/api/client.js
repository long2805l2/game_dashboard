var elasticsearch = require('elasticsearch');

var client = {};
var core = new elasticsearch.Client({  
	hosts: [
		'localhost:9200'
	]
});

client.info = () =>
{
	core.cluster.health({}, (err, resp, status) =>
	{
		console.log("-- Client Health --",resp);
	});
};

client.create = (index) =>
{
	core.indices.create(
		{index: index}
	,	(err, resp, status) =>
		{
			if(err)
		  		console.log(err);
			else
				console.log("create", resp);
		}
	);
};

client.delete = (index) =>
{
	core.indices.delete(
		{index: index}
	,	(err, resp, status) =>
		{
			if(err)
		  		console.log(err);
			else
				console.log("delete", resp);
		}
	);
};

client.document = {};
client.document.add = (document) =>
{
	core.index(
		document
	,	(err, resp, status) =>
		{
			if(err)
		  		console.log(err);
			else
				console.log("index", resp);
		}
	);
};

client.document.delete = (require) =>
{
	core.delete(
		require
	,	(err, resp, status) =>
		{
			if(err)
		  		console.log(err);
			else
				console.log("delete", resp);
		}
	);
};

client.count = (require) =>
{
	core.count (
		require
	,	(err, resp, status) =>
		{
			if(err)
		  		console.log(err);
			else
				console.log("count", resp);
		}
	);
};

client.search = async (require) =>
{
	const response = await core.search (require);
		
	// ,	(error, response, status) =>
	// 	{
	//   		if (error)
	// 			console.log("search error: ", error);
	// 		else
			{
				console.log("--- Response ---");
				console.log(response);
				console.log("--- Hits ---");
				response.hits.hits.forEach((hit) => console.log(hit));
			}
	// 	}
	// );
};
module.exports = client;