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
var analyst = {};
var private = {};
private.client = null;

private.sum = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
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

private.list = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
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
}

private.table = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to)
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

private.listFilter = async function (select_field_target, from_index_pattern, where_src, when_date_from, when_date_to, filters)
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
}

private.run = async function ()
{
	let current = "";
	let start = "2018-11-29 00:00:00";
	let end = "2018-11-29 23:59:59";

	let indexes = {
		common: (start, end) => {
			return ["common_181128", "common_181129", "common_181130"];
		}
	};
	
	let analysts = [
		analyst.login ("")
	,	analyst.register ("")
	];

	let data = {};
	for (let i in analysts)
	{
		let analyst = analysts [i];
		let collectors = analyst.require;
		for (let j in collectors)
		{
			let collector = collectors [j];
			let table = await private.table (collector.target, collector.index, collector.src, collector.start, collector.end);
			data [analyst.name] = table;
		}
	}

	let results = {};
	for (let i in analysts)
	{
		let analyst = analysts [i];
		let result = analyst.run (data);
		results [analyst.name] = result;
	}

	let documents = [];
	for (let i in results)
	{
		let d = {
			index: "report_date"
		,	id: i + "_time"
		,	type: "doc"
		,	body: results [i]
		}

		documents.push (d);
	}
	
	console.log ("documents\n", JSON.stringify (documents));

	// console.log (documents);

	// private.client.push (documents);
}

private.hourly = function ()
{

};

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

	// let today_C7 = ago30_A1.filter (userID => !today_A1.includes(userID));
	// let today_RR7 = ago30_N1.filter (userID => today_A1.includes(userID));

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

analyst.userActive = function (date)
{
	let obj = {};
	obj.name = "active";
	obj.require = [
		{
			index: ["common_181123"]
		,	src: "kvtm_LOGIN"
		,	target: ["sUserID"]
		,	start: "2018-11-23 00:00:00"
		,	end: "2018-11-23 23:59:59"
		}
	,	{
			index: ["common_181130"]
		,	src: "kvtm_LOGIN"
		,	target: ["sUserID"]
		,	start: "2018-11-30 00:00:00"
		,	end: "2018-11-30 23:59:59"
		}
	];

	obj.run = function (data)
	{
		console.log ("run\n", JSON.stringify (data));
	};

	return obj;
};

analyst.login = function (date)
{
	/*
	Login
		// Total Login (A1)
		Total login by Facebook
		Total login by Goolge
		Total login by Zing ID
	
		// Total login by IOS	
		// Total login by Android	
		Other	
		So sánh với 1 ngày trước/ 1 tuần trước
	*/
	let obj = {};
	obj.name = "active";
	obj.require = [
		{
			index: ["common_181123"]
		,	src: "kvtm_LOGIN"
		,	target: ["sUserID", "sOSPlatform", "sRequestUserId"]//bResetDaily
		,	start: "2018-11-23 00:00:00"
		,	end: "2018-11-23 23:59:59"
		}
	];

	obj.run = function (data)
	{
		data = data [obj.name];
		let result = {};
		let users = { total: [] };

		for (let i in data)
		{
			let u = data [i];
			if (u.sRequestUserId === "true")
				users.total.push (u);
		}

		for (let i in users.total)
		{
			let u = users.total[i];
			if (users [u.sOSPlatform])
				users [u.sOSPlatform].push (u.sUserID)
			else
				users [u.sOSPlatform] = [u.sUserID];
		}

		for (let i in users)
			result [i] = users [i].length;

		return result;
	};

	return obj;
};

analyst.register = function (date)
{
	/*
	NRU	Total NRU (N1)	
		Total NRU login by FB	
		Total NRU login by Google	
		Total NRU login by Zing ID	
	*/
	let obj = {};
	obj.name = "register";
	obj.require = [
		{
			index: ["common_181108"]
		,	src: "kvtm_REGISTER"
		,	target: ["sUserID", "sOSPlatform", "smf12"]//sUserName
		,	start: "2018-11-08 00:00:00"
		,	end: "2018-11-08 23:59:59"
		}
	];

	obj.run = function (data)
	{
		data = data [obj.name];
		let result = {};
		let users = { total: [] };

		for (let i in data)
		{
			let u = data [i];
			users.total.push (u);
		}

		for (let i in users.total)
		{
			let u = users.total[i];
			if (users [u.sOSPlatform])
				users [u.sOSPlatform].push (u.sUserID)
			else
				users [u.sOSPlatform] = [u.sUserID];

			let sns = u.smf12;
			if (sns)
			{
				let key = "unknow";
				if (sns.match(/fb.*/))
					key = "Facebook";
				else if (sns.match(/gg.*/))
					key = "Google";
				
				if (users [key])
					users [key].push (u.sUserID)
				else
					users [key] = [u.sUserID];
			}
		}

		for (let i in users)
			result [i] = users [i].length;

		return result;
	};

	return obj;
};

/*
Payment	IAP	Total Revenue IOS
	ZING	
	SMS	
	Banking	
	IAP	Total Revenue Android
	ZING	
	SMS	
	Banking	
New Paying User
	Total NPU theo group 5 level	
Average Playtime
	Total playtime / A1	
Monetization
	Total Gold tồn server daily	"Theo group 5 level so sánh với 1 ngày, 1 tuần trước"
	Total KC tồn server daily	
	Total Heart tồn server daily	
	Total KC in daily	
	Total spent KC daily	
	Total Gold in daily	
	Total spent gold daily	
	Total Heart in daily	
	Total spent heart daily	
Active User
	Total User active theo group 5 level	Thêm cột so sánh với 1 ngày trước, 1 tuần trước
	Top 100 level	
Revenue
	Total Revenue theo group 5 level	Thêm cột so sánh với 1 ngày trước, 1 tuần trước
	Total NPU revene theo group 5 level	
Ibshop
	Theo KC	Detail các item đã bán số lượt mua,số user mua, ave lượt/user tổng tiền, sắp xếp theo từ cao - thấp
	Theo heart	
	Theo Gold	
Offers
	Theo từng offers	Total user nhận được offer theo ngày
		Total user thanh toán cho offers theo ngày
Đơn hàng
	Total đơn hàng giao trong ngày	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total đơn hàng hằng ngày miễn phí	
	Total đơn hàng hằng ngày trả phí	
	Total đơn hàng thường	
	Total gold thưởng	
	Total KC skiptime đơn hàng.	
Airship
	Total KKC được giao	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total lượt hủy KC	
	Total gold thưởng	
	Total KC skiptime	
	Total user tham gia	
Đúc chậu
	Total lần đúc	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total thành công 	
	Total thất bại	
	Total gold spent	
	Total kc spent	
	Total User tham gia	
Private shop
	Total transection item	1 giao dịch thành công được tính là 1 trans
	Total transection KKC	Đóng thùng thành công được tính là 1 trans
	Total User tham gia	
Upgrade pot
	Total Gold thu vào	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total spent KC	
	Total lần upgrade	
	Total lần thất bại	
	Total lần Thành công	
	Top 10 chậu upgrade nhiều nhất	
Spin
	Total quay Free lần 1	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total lần paid 1 kc	
	Total paid 3 kc	
	Total paid 6 kc	
	Total paid 12 kc	
	Total Free lần 2	
	Total user tham gia	
Mine
	Total lượt đào mỏ daily	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total spent kc skiptime	
	Total uer tham gia	
	Total gold bonus	
Săn kho báu
	Total user tham gia	Theo group 5 level/ so sánh 1 ngày / 1 tuần trước/ theo ngày
	Total lượt Free	
	Total lượt 1	
	Total lượt 2	
	Total lượt 3	
	Total lượt 4	
	Total lượt 5	
	Total lượt 6	
*/

report.init = function (elasticClient)
{
	private.client = elasticClient;
};

report.run = function ()
{
	console.log ("report", "run");
	private.run ();
};

module.exports = report;