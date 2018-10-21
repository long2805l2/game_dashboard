const fs = require ("fs");
const os = require ("os");
var client = require('./api/client.js')();
var watcher = require ("./api/watcher");
var parser = require ("./api/parser");

const LOGS = {
	monitor: {
	kvtm_MONITOR_SYSTEM: ["sPrivateHost", "iPort", "icurrentUser", "icurrentConnection", "icpuProcess", "icpuSystem", "iramProcess", "iramFree", "iInPacket", "iOutPacket", "iInBytes", "iOutBytes", "iNumException"]
,	kvtm_MONITOR_SERVICE: ["sPrivateHost", "iPort", "sEnvironment", "sService", "status"]
},	gm: {
	kvtm_GM_addPrivateMail: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sMailType", "sMailId", "sMailTitle", "sMailContent", "sMailItems"]
,	kvtm_GM_addSystemMail: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sMailType", "sMailId", "sMailTitle", "sMailContent", "sMailItems", "iTimeStart", "iTimeFinish"]
,	kvtm_GM_banUser: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult"]
,	kvtm_GM_unbanUser: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult"]
,	kvtm_GM_setUserGame: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "iLevel", "iExp", "sItemLostList", "sItemReceivedList", "bResetDaily"]
,	kvtm_GM_setUserAirship: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "iNumRequest", "iTimeWait"]
,	kvtm_GM_updateUserCoin: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "iCoinBefore", "iCoin", "iCoinAfter"]
,	kvtm_GM_mapDeviceId: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sToUserID", "sDeviceID"]
,	kvtm_GM_setActiveGroup: ["sAdmin", "sRemoteAddress", "sReason", "sUserID", "sServerID", "iResult", "sService", "sGroup"]
},	common: {
	kvtm_LEVEL_UP: ["timestamp", "sUserID", "sServerID", "iOldLevel", "iNewLevel", "iExp", "sTransactionID", "sItemReceivedList"]
,	kvtm_SPENT_COIN: ["timestamp", "sUserID", "sServerID", "sActionName", "sTransactionID", "sItemID", "sItemName", "iQuantity", "iSpentCoin", "iCoinAfter", "iResult"]
,	kvtm_PAYING: ["timestamp", "sUserID", "sServerID", "sPaymentGateway", "sPayingTypeID", "sTransactionID", "iGrossRevenue_User", "iGrossRevenue", "iCoinReceived", "iCoinRemain", "iResult", "iChangeCash", "iChangePromo"]
,	kvtm_LOGIN: ["timestamp", "sUserID", "sServerID", "sGameClientVersion", "sOSPlatform", "sOSVersion", "sDeviceID", "sDeviceName", "sConnectionType", "iLevel", "iExp", "iCoinBalance", "sSessionID", "iResult", "sRequestSessionPortal", "sRequestUserId", "sRequestSessionFile"]
,	kvtm_LOGOUT: ["timestamp", "sUserID", "sServerID", "iLevel", "iExp", "iCoinBalance", "sSessionID", "iTotalOnlineSecond", "iResult"]
,	kvtm_CONVERT_OLD_DATA: ["sUserId", "sUserName", "sOldUserId", "sFacebookId", "iCoinCash", "iCoinPromo", "iLevel", "iExp", "iGold", "iReputation"]
,	kvtm_REGISTER: ["timestamp", "sUserID", "sServerID", "sGameClientVersion", "sOSPlatform", "sOSVersion", "sDeviceID", "sDeviceName", "sConnectionType", "sDownloadSource", "sThirdPartySource", "iResult"]
},	action: {
	kvtm_ACTION_POT_STORE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sSlotResult", "sPots"]
,	kvtm_ACTION_POT_MOVE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFromFloor", "iRequestFromSlot", "iRequestToFloor", "iRequestToSlot", "idPot"]
,	kvtm_ACTION_POT_UPGRADE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestSlot", "iRequestGreenGrass"]
,	kvtm_ACTION_PLANT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestPlant", "sRequestFloors", "sRequestSlots", "sRequestTimes", "sSlotResult"]
,	kvtm_ACTION_PLANT_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestSlot", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PLANT_CATCH_BUG: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sRequestTimes", "sSlotResult"]
,	kvtm_ACTION_PLANT_HARVEST: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "sRequestFloors", "sRequestSlots", "sSlotResult"]
,	kvtm_ACTION_MACHINE_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_SKIP_TIME_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iTimeWait"]
,	kvtm_ACTION_MACHINE_FINISH_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult","iCoinAfter", "iGoldAfter", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_REPAIR: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineDurability", "iPrice"]
,	kvtm_ACTION_MACHINE_UPGRADE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "isSuccess", "iMachineLevel", "iMachineDurability", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iPriceGold"]
,	kvtm_ACTION_MACHINE_BUY_SLOT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineNumSlot", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_MACHINE_BUY_WORKING_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineWorkingTime", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iTimeSkip"]
,	kvtm_ACTION_MACHINE_PRODUCE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "sRequestProduct"]
,	kvtm_ACTION_MACHINE_HARVEST: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_SKIP_TIME_PRODUCE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloor", "sRequestClientCoin", "sRequestPriceCoin", "iPrice", "sProductId"]
,	kvtm_ACTION_ORDER_DELIVERY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iNewOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "iOrderId"]
,	kvtm_ACTION_ORDER_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iNewOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_ACTIVE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iRequestId"]
,	kvtm_ACTION_PRIVATE_SHOP_PUT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot", "iRequestClientCoin", "iRequestFee", "iRequestItem", "iRequestNum", "iRequestPriceSell", "bHasAd"]
,	kvtm_ACTION_PRIVATE_SHOP_AD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_GET_MONEY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_UNLOCK_COIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_NEWS_BOARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_FRIEND_BUY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFriendId", "iRequestIdSlot"]
,	kvtm_ACTION_UPDATE_COIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_AIRSHIP_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_AIRSHIP_SKIP_TIME_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_AIRSHIP_SKIP_TIME_INACTIVE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_AIRSHIP_PACK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_AIRSHIP_DELIVERY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentReputation"]
,	kvtm_ACTION_AIRSHIP_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult"]
,	kvtm_ACTION_AIRSHIP_REQUEST_HELP: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iRequestSlotId"]
,	kvtm_ACTION_AIRSHIP_GET: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult"]
,	kvtm_ACTION_AIRSHIP_FRIEND_PACK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFriendId", "iRequestSlotId"]
,	kvtm_ACTION_AIRSHIP_NEWS_BOARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_TOM_HIRE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestType", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "bIsSaleOff"]
,	kvtm_ACTION_TOM_FIND: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestItem", "sRequestSupport", "iMultiple"]
,	kvtm_ACTION_TOM_BUY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestSlot"]
,	kvtm_ACTION_TOM_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_TOM_REDUCE_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestSupport", "iReduceTime"]
,	kvtm_ACTION_LUCKY_SPIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_LUCKY_SPIN_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iGoldAfter", "iRequestClientCoin", "iWinSlot"]
,	kvtm_ACTION_GET_USER_DATA: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_MAIL_MARK_READ: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailId"]
,	kvtm_ACTION_MAIL_DELETE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailId"]
,	kvtm_ACTION_MAIL_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailId"]
,	kvtm_ACTION_BLACKSMITH_MAKE_POT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "sRequestPot", "bForgeSuccess"]
,	kvtm_ACTION_OPEN_BUILDING_GAME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "bIsOpenBuidingGame"]
,	kvtm_ACTION_DICE_SPIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iDiceX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_DICE_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iDiceX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_DECOR_PUT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter","iRequestDecor", "sRequestFloors", "sRequestSlots", "sSlotResult"]
,	kvtm_ACTION_DECOR_STORE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sSlotResult", "sDecors"]
,	kvtm_ACTION_DAILY_GIFT_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iPos"]
,	kvtm_ACTION_MINE_GET_INFO: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iMineStatus", "sMineRequireItems", "sMineReceiveItems", "sMineFinishTime"]
,	kvtm_ACTION_MINE_START: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iMineStatus", "sMineRequireItems", "sMineReceiveItems", "sMineFinishTime"]
,	kvtm_ACTION_MINE_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iMineStatus", "sMineFinishTime", "iCoinBefore", "iCoinAfter"]
,	kvtm_ACTION_MINE_RECEIVE_REWARDS: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult"]
,	kvtm_ACTION_GACHA_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "sItemLostList", "sItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iReputationAfter", "iExpAfter", "sChestId", "sWinItem", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
}};

// const rawDir = "../static/private/log/raw";
const rawDir = "d:/Project/els/product/logs_raw";
const cacheDir = "../static/private/log/cache";

function start ()
{
	client.connect ();
	client.init (LOGS);

	for (let catalog in LOGS)
	{
		let log = LOGS [catalog];
		for (let id in log)
		{
			let design = log[id];
			let dir = rawDir + "/" + id;
			let p = parser (catalog, id, design, "\n", "\t");

			if (!fs.existsSync(dir))
				fs.mkdirSync(dir);
			
			let w = watcher();
			w.start (dir, cacheDir, p, client);
		}
	}
}

start ();