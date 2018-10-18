var client = require('./api/client.js');
var watcher = require ("./api/watcher")();

const LOGS = {
//	MONITOR LOGS
	kvtm_MONITOR_SYSTEM: ["sPrivateHost", "iPort", "icurrentUser", "icurrentConnection", "icpuProcess", "icpuSystem", "iramProcess", "iramFree", "iInPacket", "iOutPacket", "iInBytes", "iOutBytes", "iNumException"]
,	kvtm_MONITOR_SERVICE: ["sPrivateHost", "iPort", "sEnvironment", "sService", "status"]
//	GM LOGS
,	kvtm_GM_addPrivateMail: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sMailType", "sMailId", "sMailTitle", "sMailContent", "sMailItems"]
,	kvtm_GM_addSystemMail: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sMailType", "sMailId", "sMailTitle", "sMailContent", "sMailItems", "iTimeStart", "iTimeFinish"]
,	kvtm_GM_banUser: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult"]
,	kvtm_GM_unbanUser: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult"]
,	kvtm_GM_setUserGame: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "iLevel", "iExp", "sItemLostList", "sItemReceivedList", "bResetDaily"]
,	kvtm_GM_setUserAirship: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "iNumRequest", "iTimeWait"]
,	kvtm_GM_updateUserCoin: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "iCoinBefore", "iCoin", "iCoinAfter"]
,	kvtm_GM_mapDeviceId: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sToUserID", "sDeviceID"]
,	kvtm_GM_setActiveGroup: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sService", "sGroup"]
//	COMMON LOGS
,	kvtm_LEVEL_UP: ["sDate", "sUserID", "sServerID", "iOldLevel", "iNewLevel", "iExp", "sTransactionID", "sItemReceivedList"]
,	kvtm_SPENT_COIN: ["sDate", "sUserID", "sServerID", "sActionName", "sTransactionID", "sItemID", "sItemName", "iQuantity", "iSpentCoin", "iCoinAfter", "iResult"]
,	kvtm_PAYING: ["sDate", "sUserID", "sServerID", "sPaymentGateway", "sPayingTypeID", "sTransactionID", "iGrossRevenue_User", "iGrossRevenue", "iCoinReceived", "iCoinRemain", "iResult", "iChangeCash", "iChangePromo"]
,	kvtm_LOGIN: ["sDate", "sUserID", "sServerID", "sGameClientVersion", "sOSPlatform", "sOSVersion", "sDeviceID", "sDeviceName", "sConnectionType", "iLevel", "iExp", "iCoinBalance", "sSessionID", "iResult", "sRequestSessionPortal", "sRequestUserId", "sRequestSessionFile"]
,	kvtm_LOGOUT: ["sDate", "sUserID", "sServerID", "iLevel", "iExp", "iCoinBalance", "sSessionID", "iTotalOnlineSecond", "iResult"]
,	kvtm_CONVERT_OLD_DATA: ["sUserId", "sUserName", "sOldUserId", "sFacebookId", "iCoinCash", "iCoinPromo", "iLevel", "iExp", "iGold", "iReputation"]
,	kvtm_REGISTER: ["sDate", "sUserID", "sServerID", "sGameClientVersion", "sOSPlatform", "sOSVersion", "sDeviceID", "sDeviceName", "sConnectionType", "sDownloadSource", "sThirdPartySource", "iResult"]
//	PLAYER ACTION LOGS
,	kvtm_ACTION_POT_STORE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sSlotResult", "sPots"]
,	kvtm_ACTION_POT_MOVE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFromFloor", "iRequestFromSlot", "iRequestToFloor", "iRequestToSlot", "idPot"]
,	kvtm_ACTION_POT_UPGRADE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestSlot", "iRequestGreenGrass"]
,	kvtm_ACTION_PLANT: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestPlant", "sRequestFloors", "sRequestSlots", "sRequestTimes", "sSlotResult"]
,	kvtm_ACTION_PLANT_SKIP_TIME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestSlot", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PLANT_CATCH_BUG: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sRequestTimes", "sSlotResult"]
,	kvtm_ACTION_PLANT_HARVEST: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "sRequestFloors", "sRequestSlots", "sSlotResult"]
,	kvtm_ACTION_MACHINE_UNLOCK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_SKIP_TIME_UNLOCK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iTimeWait"]
,	kvtm_ACTION_MACHINE_FINISH_UNLOCK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult","iCoinAfter", "iGoldAfter", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_REPAIR: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineDurability", "iPrice"]
,	kvtm_ACTION_MACHINE_UPGRADE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "isSuccess", "iMachineLevel", "iMachineDurability", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iPriceGold"]
,	kvtm_ACTION_MACHINE_BUY_SLOT: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineNumSlot", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_MACHINE_BUY_WORKING_TIME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineWorkingTime", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iTimeSkip"]
,	kvtm_ACTION_MACHINE_PRODUCE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "sRequestProduct"]
,	kvtm_ACTION_MACHINE_HARVEST: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_SKIP_TIME_PRODUCE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloor", "sRequestClientCoin", "sRequestPriceCoin", "iPrice", "sProductId"]
,	kvtm_ACTION_ORDER_DELIVERY: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iNewOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_GET_REWARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "iOrderId"]
,	kvtm_ACTION_ORDER_CANCEL: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iNewOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_ACTIVE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_SKIP_TIME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iRequestId"]
,	kvtm_ACTION_PRIVATE_SHOP_PUT: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot", "iRequestClientCoin", "iRequestFee", "iRequestItem", "iRequestNum", "iRequestPriceSell", "bHasAd"]
,	kvtm_ACTION_PRIVATE_SHOP_AD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_SKIP_TIME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_CANCEL: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_GET_MONEY: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_UNLOCK_COIN: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_NEWS_BOARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_FRIEND_BUY: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFriendId", "iRequestIdSlot"]
,	kvtm_ACTION_UPDATE_COIN: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_AIRSHIP_UNLOCK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_AIRSHIP_SKIP_TIME_UNLOCK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_AIRSHIP_SKIP_TIME_INACTIVE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_AIRSHIP_PACK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_AIRSHIP_DELIVERY: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentReputation"]
,	kvtm_ACTION_AIRSHIP_CANCEL: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult"]
,	kvtm_ACTION_AIRSHIP_REQUEST_HELP: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iRequestSlotId"]
,	kvtm_ACTION_AIRSHIP_GET: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult"]
,	kvtm_ACTION_AIRSHIP_FRIEND_PACK: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFriendId", "iRequestSlotId"]
,	kvtm_ACTION_AIRSHIP_NEWS_BOARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_TOM_HIRE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestType", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "bIsSaleOff"]
,	kvtm_ACTION_TOM_FIND: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestItem", "sRequestSupport", "iMultiple"]
,	kvtm_ACTION_TOM_BUY: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestSlot"]
,	kvtm_ACTION_TOM_CANCEL: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_TOM_REDUCE_TIME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestSupport", "iReduceTime"]
,	kvtm_ACTION_LUCKY_SPIN: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_LUCKY_SPIN_GET_REWARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iGoldAfter", "iRequestClientCoin", "iWinSlot"]
,	kvtm_ACTION_GET_USER_DATA: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_MAIL_MARK_READ: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailId"]
,	kvtm_ACTION_MAIL_DELETE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailId"]
,	kvtm_ACTION_MAIL_GET_REWARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailId"]
,	kvtm_ACTION_BLACKSMITH_MAKE_POT: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "sRequestPot", "bForgeSuccess"]
,	kvtm_ACTION_OPEN_BUILDING_GAME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "bIsOpenBuidingGame"]
,	kvtm_ACTION_DICE_SPIN: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iDiceX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_DICE_GET_REWARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iDiceX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_DECOR_PUT: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter","iRequestDecor", "sRequestFloors", "sRequestSlots", "sSlotResult"]
,	kvtm_ACTION_DECOR_STORE: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sSlotResult", "sDecors"]
,	kvtm_ACTION_DAILY_GIFT_GET_REWARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iPos"]
,	kvtm_ACTION_MINE_GET_INFO: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iMineStatus", "sMineRequireItems", "sMineReceiveItems", "sMineFinishTime"]
,	kvtm_ACTION_MINE_START: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iMineStatus", "sMineRequireItems", "sMineReceiveItems", "sMineFinishTime"]
,	kvtm_ACTION_MINE_SKIP_TIME: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iMineStatus", "sMineFinishTime", "iCoinBefore", "iCoinAfter"]
,	kvtm_ACTION_MINE_RECEIVE_REWARDS: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult"]
,	kvtm_ACTION_GACHA_GET_REWARD: ["sDate", "sUserID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iReputationAfter", "iExpAfter", "sChestId", "sWinItem", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
};

const rawDir = "../static/private/log/raw";
const cacheDir = "../static/private/log/cache";

watcher.start (rawDir, cacheDir,
(dir, file, lines) => 
{
	console.log (dir, file, lines);
});

// tail.on("error", function(error) {
// 	console.log('ERROR: ', error);
// 	tail.unwatch();
// });

// client.create ("gov");
// client.document.add(
// 	{  
// 		index: 'gov',
// 		id: '2',
// 		type: 'constituencies',
// 		body: {
// 			"ConstituencyName": "Harwich",
// 			"ConstituencyID": "E14000761",
// 			"ConstituencyType": "Borough",
// 			"Electorate": 74500,
// 			"ValidVotes": 48694,
// 		}
// 	}
// );

// client.document.delete (
// 	{
// 		index: 'gov'
// 	,	id: '1'
// 	,	type: 'constituencies'
// 	}
// );

// client.count ({index:"gov", type: "constituencies"});

// client.search ({  
// 	index: 'gov',
// 	type: 'constituencies',
// 	body: {
// 		query: {
// 			match: { ConstituencyName: "Harwich" }
// 		},
// 	}
// });