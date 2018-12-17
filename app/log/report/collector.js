var collector = {};
var private = {};
private.client = null;

collector.init = function (elastic)
{
	private.client = elastic;
};

collector.count_unique = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
{
	let query_body = {
		size: 0,
		query: {
			bool: {
				must: { match: { src: where_src } },
				filter: { range: { timestamp: { gte: when_date_from, lte: when_date_to } } }
			}
		},
		aggs:
		{
			result: { sum: { field: select_field_target } }
		}
	};

	console.log (JSON.stringify (query_body));
	let response = await private.client.search (from_index_pattern, query_body);
	let result = private.get (response);
		return -1;
	
	if (!result["aggregations"])
		return -1;
	
	if (!result.aggregations["results"])
		return -1;
	
	if (!result.aggregations.results["buckets"])
		return -1;
	
	// let buckets = result.aggregations.results.buckets;
	// let targets = [];

	// for (let i = 0; i < buckets.length; i++)
	// 	targets.push (buckets[i].key);

	// return targets;
};

collector.sum = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
{
	let query_body = {
		size: 0,
		query: {
			bool: {
				must: { match: { src: where_src } },
				filter: { range: { timestamp: { gte: when_date_from, lte: when_date_to } } }
			}
		},
		aggs:
		{
			result: { sum: { field: select_field_target } }
		}
	};

	console.log (JSON.stringify (query_body));
	let result = await private.client.search (from_index_pattern, query_body);
	if (!result)
		return [];
	
	if (!result["aggregations"])
		return [];
	
	if (!result.aggregations["results"])
		return [];
	
	if (!result.aggregations.results["buckets"])
		return [];
	
	let buckets = result.aggregations.results.buckets;
	let targets = [];

	for (let i = 0; i < buckets.length; i++)
		targets.push (buckets[i].key);

	return targets;
};

collector.list = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
{
	let query_body = {
		size: 0,
		query: {
			bool: {
				must: { match: { src: where_src } },
				filter: { range: { timestamp: { gte: when_date_from, lte: when_date_to } } }
			}
		},
		aggs: { results: { terms: { field: select_field_target } } }
	};

	console.log (JSON.stringify (query_body));
	let result = await private.client.search (from_index_pattern, query_body);
	if (!result)
		return [];
	
	if (!result["aggregations"])
		return [];
	
	if (!result.aggregations["results"])
		return [];
	
	if (!result.aggregations.results["buckets"])
		return [];
	
	let buckets = result.aggregations.results.buckets;
	let targets = [];

	for (let i = 0; i < buckets.length; i++)
		targets.push (buckets[i].key);

	return targets;
};

collector.table = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
{
	let query_body = {
		_source: select_field_target,
		query: {
			bool: {
				must: { match: { src: where_src } },
				filter: { range: { timestamp: { gte: when_date_from, lte: when_date_to } } }
			}
		}
	};

	let result = await private.client.search (from_index_pattern, query_body, "hits.hits._source");
	if (!result)
		return [];
	
	// console.log ("private.table\n", JSON.stringify (result));
	if (!result["hits"])
		return [];
	
	if (!result.hits["hits"])
		return [];
	
	let hits = result.hits.hits;
	let targets = [];

	for (let i in hits)
		targets.push (hits[i]._source);

	return targets;
}

collector.listFilter = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to, filters)
{
	let terms = {};
	terms [select_field_target] = filters;

	let query_body = {
		size: 0,
		query: {
			bool: {
				must:[
					{ match: { src: where_src }},
					{ terms: terms}
				],
				filter: { range: { timestamp: { gte: when_date_from, lte: when_date_to } } }
			}
		},
		aggs: { results: { terms: { field: select_field_target } } }
	};

	let result = await private.client.search (from_index_pattern, query_body);
	
	if (!result["aggregations"])
		return [];
		
	if (!result.aggregations["results"])
		return [];

	if (!result.aggregations.results["buckets"])
		return [];

	let buckets = result.aggregations.results.buckets;
	let targets = [];

	for (let i = 0; i < buckets.length; i++)
		targets.push (buckets[i].key);

	return targets;
};

module.exports = collector;