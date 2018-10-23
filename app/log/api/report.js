var report = {};
var private = {};
var client = null;

private.select = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
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

	let result = await client.search (from_index_pattern, query_body);
	
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
}

private.selectFilter = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to, filters)
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

	let result = await client.search (from_index_pattern, query_body);
	
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
}

private.daily = function ()
{
	let date = Date.now();
	let today = date.toISOString().slice(0, 10);
	let today_start = today + " 00:00:00";
	let today_end = today + " 23:59:59";

	date = date.setDate (date.getDate - 1);
	let yesterday = date.toISOString().slice(0, 10);
	let yesterday_start = yesterday + " 00:00:00";
	let yesterday_end = yesterday + " 23:59:59";

	let today_A1 = private.select ("sUserID", "common_*", "kvtm_LOGIN", today_start, today_end);
	let today_N1 = private.select ("sUserID", "common_*", "kvtm_REGISTER", today_start, today_end);

	let yesterday_A1 = private.select ("sUserID", "common_*", "kvtm_LOGIN", yesterday_start, yesterday_end);
	let yesterday_N1 = private.select ("sUserID", "common_*", "kvtm_REGISTER", yesterday_start, yesterday_end);

	let today_C1 = yesterday_N1.filter (userID => !today_A1.includes(userID));
	let today_RR1 = yesterday_A1.filter (userID => today_A1.includes(userID));

	return {
		A1: today_A1
	,	N1: today_N1
	,	C1: today_C1
	,	RR1: today_RR1
	,	CCU: []
	,	ACU: 0
	,	PCU: 0
	}
};

private.weekly = function ()
{
	let dayC = "2018-09-30";
	let dayC_start = dayC + " 00:00:00";
	let dayC_end = dayC + " 23:59:59";

	let day7_A = private.select ("sUserID", "common_*", "kvtm_LOGIN", dayA_start, dayC_end);
	let day7_N = private.select ("sUserID", "common_*", "kvtm_REGISTER", dayA_start, dayC_end);

	let dayC_A = private.select ("sUserID", "common_*", "kvtm_LOGIN", dayC_start, dayC_end);
	let dayC_N = private.select ("sUserID", "common_*", "kvtm_REGISTER", dayC_start, dayC_end);

	let dayAC_C = dayC_N.filter (userID => !dayA_A.includes(userID));
	let dayAC_R = dayC_A.filter (userID => dayA_A.includes(userID));

	let dayD = "2018-10-01";
	let dayD_start = dayD + " 00:00:00";
	let dayD_end = dayD + " 23:59:59";
	
	let dayA_A = private.select ("sUserID", "common_*", "kvtm_LOGIN", dayD_start, dayD_end);
	let dayA_N = private.select ("sUserID", "common_*", "kvtm_REGISTER", dayD_start, dayD_end);
};

private.monthly = function ()
{
	let dayD = "2018-10-01";
	let dayD_start = dayD + " 00:00:00";
	let dayD_end = dayD + " 23:59:59";
	
	let dayA_A = private.select ("sUserID", "common_*", "kvtm_LOGIN", dayD_start, dayD_end);
	let dayA_N = private.select ("sUserID", "common_*", "kvtm_REGISTER", dayD_start, dayD_end);

	let day30_A = private.select ("sUserID", "common_*", "kvtm_LOGIN", dayD_start, dayA_end);
	let day30_N = private.select ("sUserID", "common_*", "kvtm_REGISTER", dayD_start, dayA_end);
};

report.daily = function ()
{

};

module.exports = report;