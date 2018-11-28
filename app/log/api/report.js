const date = require ("./date.js");

/*
∈				element of				x is element of set A => x ∈ set A
∉				not element of			x don't element of set A => x ∉ set A
∩				Intersection			x ∈ set A && x ∈ set B => x ∈ A ∩ B
∪				Union					x ∈ set A || x ∈ set B => x ∈ A ∪ B
\				Relative Complement		x ∈ set A && x ∉ set B => x ∈ A \ B
DAU				
MAU				
A1				count of unique userID has Active in Day
A7				count of unique userID has Active in Week
A30				count of unique userID has Active in Month
N1				count of New userID in Day
N7				count of New userID in Week
N30				count of New userID in Month
C1				Churn rate = count of (A1 yesterday \ A1 today) / count of (A1 yesterday)
C7				?
C30				?
RR1				Retension Rate today = count of (N1 yesterday ∩ A1 today) / count of (N1 yesterday)
RR7				?
RR30			?	
NET Revenue		Gross Revenue remain after all deductions are made (tax, play store ...)
Gross Revenue	total real money is purchase to this game by players
ARPU			Average Revenue Per User = Revenue / A1
ARPPU			Average Revenue Per Paying User = Revenue / Paying Users
CVR				Conversion Rate	= Non Paying Users / New Paying Users
ChargeUser		?
NewChargeUser	?
Coin Spent		total coin is used by players for furture in this game
Coin In-Stock	total recieve coin - Coin Spent
*/

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
	let today = date ();
	let today_start = today.startDay ();
	let today_end = today.endDay ();

	let yesterday_start = today.yesterday ();
	let yesterday_end = yesterday_start.endDay ();

	let today_A1 = private.select ("sUserID", "common_*", "kvtm_LOGIN", today_start.toString(), today_end.toString());
	let today_N1 = private.select ("sUserID", "common_*", "kvtm_REGISTER", today_start.toString(), today_end.toString());

	let yesterday_A1 = private.select ("sUserID", "common_*", "kvtm_LOGIN", yesterday_start.toString(), yesterday_end.toString());
	let yesterday_N1 = private.select ("sUserID", "common_*", "kvtm_REGISTER", yesterday_start.toString(), yesterday_end.toString());

	let today_C1 = yesterday_N1.filter (userID => !today_A1.includes(userID));
	let today_RR1 = yesterday_A1.filter (userID => today_A1.includes(userID));

	let week_start = today.sunday();
	let week_end = today.saturday().endDay();

	let week_A7 = private.select ("sUserID", "common_*", "kvtm_LOGIN", week_start.toString(), week_end.toString());
	let week_N7 = private.select ("sUserID", "common_*", "kvtm_REGISTER", week_start.toString(), week_end.toString());

	let month_start = today.startMonth();
	let month_end = today.endMonth().endDay();

	let month_A30 = private.select ("sUserID", "common_*", "kvtm_LOGIN", month_start.toString(), month_end.toString());
	let month_N30 = private.select ("sUserID", "common_*", "kvtm_REGISTER", month_start.toString(), month_end.toString());

	let ago7_start = today.shift (-7);
	let ago7_end = ago7_start.endDay ();

	let ago7_A1 = private.select ("sUserID", "common_*", "kvtm_LOGIN", ago7_start.toString(), ago7_end.toString());
	let ago7_N1 = private.select ("sUserID", "common_*", "kvtm_REGISTER", ago7_start.toString(), ago7_end.toString());

	let today_C7 = ago7_A1.filter (userID => !today_A1.includes(userID));
	let today_RR7 = ago7_N1.filter (userID => today_A1.includes(userID));

	let ago30_start = today.shift (-30);
	let ago30_end = ago30_start.endDay ();

	let ago30_A1 = private.select ("sUserID", "common_*", "kvtm_LOGIN", ago30_start.toString(), ago30_end.toString());
	let ago30_N1 = private.select ("sUserID", "common_*", "kvtm_REGISTER", ago30_start.toString(), ago30_end.toString());

	let today_C7 = ago30_A1.filter (userID => !today_A1.includes(userID));
	let today_RR7 = ago30_N1.filter (userID => today_A1.includes(userID));

	return {
		A1: today_A1
	,	N1: today_N1
	,	C1: today_C1
	,	C7: today_C7
	,	C30: today_C30
	,	RR1: today_RR1
	,	RR7: today_RR7
	,	RR30: today_RR30
	,	CCU: []
	,	ACU: 0
	,	PCU: 0
	,	A7: week_A7
	,	N7: week_N7
	,	A30: month_A30
	,	N30: month_N30
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