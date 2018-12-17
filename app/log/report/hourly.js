var analyst = {};
var private = {};
private.name = "hour";
private.client = "";

private.get = (obj, path, defaultValue = null) =>
{
	if (!obj)
		return defaultValue;

	let p = path.split (".");
	let t = obj;
	for (let i in p)
	{
		let n = p [i];
		if (n in t)
			t = t[n];
		else
			return defaultValue;
	}
	return t;
}

private.airship = {};
private.airship.total_delivery = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: { match: { src: "kvtm_ACTION_AIRSHIP_DELIVERY" } },
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sTransactionID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.airship.total_cancel = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: { match: { src: "kvtm_ACTION_AIRSHIP_CANCEL" } },
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sTransactionID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.airship.total_gold_recive = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: { match: { src: "kvtm_ACTION_AIRSHIP_PACK" } },
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { sum: { field: "mItemReceivedList_GOLD" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.airship.total_coin_skip_time = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: { match: { src: "kvtm_ACTION_AIRSHIP_SKIP_TIME_INACTIVE" } },
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { sum: { field: "mItemLostList_COIN" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.airship.total_active = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				should: [
					{ match: { src: "kvtm_ACTION_AIRSHIP_PACK" } },
					{ match: { src: "kvtm_ACTION_AIRSHIP_DELIVERY" } },
					{ match: { src: "kvtm_ACTION_AIRSHIP_CANCEL" } },
					{ match: { src: "kvtm_ACTION_AIRSHIP_FRIEND_PACK" } },
					{ match: { src: "kvtm_ACTION_AIRSHIP_SKIP_TIME_INACTIVE" } }
				],
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sUserID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.blacksmith = {};
private.blacksmith.total = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: { match: { src: "kvtm_ACTION_BLACKSMITH_MAKE_POT" } },
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sTransactionID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.blacksmith.total_success = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: [
					{ match: { src: "kvtm_ACTION_BLACKSMITH_MAKE_POT" } },
					{ match: { bForgeSuccess: true } }
				],
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sTransactionID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.blacksmith.total_fail = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: [
					{ match: { src: "kvtm_ACTION_BLACKSMITH_MAKE_POT" } },
					{ match: { bForgeSuccess: false } }
				],
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sTransactionID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.blacksmith.total_active = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: [
					{ match: { src: "kvtm_ACTION_BLACKSMITH_MAKE_POT" } },
					{ match: { bForgeSuccess: false } }
				],
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { cardinality: { field: "sUserID" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

private.blacksmith.total_gold_spent = async (timeStart, timeEnd, levelStart, levelEnd) =>
{
	let query_body = {
		query: {
			bool: {
				must: { match: { src: "kvtm_ACTION_BLACKSMITH_MAKE_POT" } },
				filter: [
					{ range: { timestamp: { gte: timeStart, lte: timeEnd } } },
					{ range: { iLevel: { gte: levelStart - 1, lte: levelEnd + 1 } } },
				]
			}
		},
		aggs: { result: { sum: { field: "mItemLostList_GOLD" } } }
	};

	let response = await private.client.search ("action_*", query_body, "aggregations.result.value");
	let result = private.get (response, "aggregations.result.value");
	
	return result;
};

analyst.run = async function (elastic)
{
	console.log (private.name, "running ...");
	private.client = elastic;

	let start = "2018-11-21 00:00:00";
	let end = "2018-11-21 23:59:59";
	let features = ["airship", "blacksmith"];

	console.log (private.name, start, end);
	for (let f in features)
	{
		let name = features [f];
		let feature = private [name];
		console.log ("feature", name, feature ? "ready" : "null");
		if (!feature)
			continue;
		
		for (let i in feature)
		{
			if (typeof (feature [i]) !== "function")
				continue;
			
			for (let level = 1; level < 300; level += 5)
			{
				let result = await feature [i] (start, end, level, level + 5 - 1);
				if (result)
					console.log (name, i, level, level + 5 - 1, result);
			}
		}
	}
};

module.exports = analyst;