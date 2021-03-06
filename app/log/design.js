const LOGS = {
	monitor: {
	kvtm_MONITOR_SYSTEM: ["timestamp", "sPrivateHost", "sGroup", "sEnvironment", "sService", "icurrentUser", "icurrentConnection", "icpuProcess", "icpuSystem", "iramProcess", "iramFree", "iInBytes", "iOutBytes", "iNumException", "iItemAirship", "iNumItemPrivateShop"]
,	kvtm_MONITOR_SERVICE: ["timestamp", "sPrivateHost", "sGroup", "sEnvironment", "sService", "status"]
},	gm: {
	kvtm_GM_addPrivateMail: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "sMailType", "sMailID", "sMailTitle", "sMailContent", "sMailItems"]
,	kvtm_GM_addSystemMail: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "sMailType", "sMailID", "sMailTitle", "sMailContent", "sMailItems", "iTimeStart", "iTimeFinish"]
,	kvtm_GM_banUser: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult"]
,	kvtm_GM_unbanUser: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult"]
,	kvtm_GM_setUserGame: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "iLevel", "iExp", "mItemLostList", "mItemReceivedList", "bResetDaily"]
,	kvtm_GM_setUserAirship: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "iNumRequest", "iTimeWait"]
,	kvtm_GM_updateUserCoin: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "iCoinBefore", "iCoin", "iCoinAfter"]
,	kvtm_GM_mapDeviceId: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "sToUserID", "sDeviceID"]
,	kvtm_GM_setActiveGroup: ["timestamp", "sUserID", "sServerID", "sAdmin", "sRemoteAddress", "sReason", "iResult", "sService", "sGroup"]
},	common: {
	kvtm_LEVEL_UP: ["timestamp", "sUserID", "sServerID", "iOldLevel", "iNewLevel", "iExp", "sTransactionID", "mItemReceivedList"]
,	kvtm_SPENT_COIN: ["timestamp", "sUserID", "sServerID", "sActionName", "sTransactionID", "sItemID", "sItemName", "iQuantity", "iSpentCoin", "iCoinAfter", "iResult"]
,	kvtm_PAYING: ["timestamp", "sUserID", "sServerID", "sPaymentGateway", "sPayingType", "sPayingSubType", "sAppTransactionID", "sPayTransactionID", "sBilTransactionID", "sItemID", "iResult", "sDescription", "iGross", "iNet", "iCoinRemain", "iCoinCash", "iCoinPromo", "iCoinConvert", "iAddCash", "iAddPromo"]
,	kvtm_LOGIN: ["timestamp", "sUserID", "sServerID", "sGameClientVersion", "sOSPlatform", "sOSVersion", "sDeviceID", "sDeviceName", "sConnectionType", "iLevel", "iExp", "iCoinBalance", "sSessionID", "iResult", "sClientIp", "bResetDaily", "iGold", "sServiceIp", "sServiceGroup"]
,	kvtm_LOGOUT: ["timestamp", "sUserID", "sServerID", "iLevel", "iExp", "iCoinBalance", "sSessionID", "iTotalOnlineSecond", "iResult"]
,	kvtm_CONVERT_OLD_DATA: ["sUserID", "sUserName", "sOldUserId", "sFacebookId", "iCoinCash", "iCoinPromo", "iLevel", "iExp", "iGold", "iReputation"]
,	kvtm_REGISTER: ["timestamp", "sUserID", "sServerID", "sGameClientVersion", "sOSPlatform", "sOSVersion", "sDeviceID", "sDeviceName", "sConnectionType", "sDownloadSource", "sThirdPartySource", "iResult", "sUserName", "sTransactionID", "iRemoveOldCoin"]
},	billing: {
	kvtm_BILLING: ["sUserID", "sServerID", "iResult", "iRemain", "iDeltaTime", "sRequest", "sResponse"]
},	action: {
	kvtm_ACTION_POT_STORE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sSlotResult", "sPots"]
,	kvtm_ACTION_POT_MOVE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFromFloor", "iRequestFromSlot", "iRequestToFloor", "iRequestToSlot", "idPot"]
,	kvtm_ACTION_POT_UPGRADE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestSlot", "iRequestGreenGrass"]
,	kvtm_ACTION_PLANT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestPlant", "sRequestFloors", "sRequestSlots", "sRequestTimes", "sSlotResult"]
,	kvtm_ACTION_PLANT_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestSlot", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PLANT_CATCH_BUG: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sRequestTimes", "sSlotResult"]
,	kvtm_ACTION_PLANT_HARVEST: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "sRequestFloors", "sRequestSlots", "sSlotResult"]
,	kvtm_ACTION_MACHINE_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_SKIP_TIME_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iTimeWait"]
,	kvtm_ACTION_MACHINE_FINISH_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult","iCoinAfter", "iGoldAfter", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_REPAIR: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineDurability", "iPrice"]
,	kvtm_ACTION_MACHINE_UPGRADE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "isSuccess", "iMachineLevel", "iMachineDurability", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iPriceGold"]
,	kvtm_ACTION_MACHINE_BUY_SLOT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineNumSlot", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_MACHINE_BUY_WORKING_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "iMachineWorkingTime", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iTimeSkip"]
,	kvtm_ACTION_MACHINE_PRODUCE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestFloor", "sRequestProduct"]
,	kvtm_ACTION_MACHINE_HARVEST: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "iRequestFloor"]
,	kvtm_ACTION_MACHINE_SKIP_TIME_PRODUCE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloor", "sRequestClientCoin", "sRequestPriceCoin", "iPrice", "sProductId"]
,	kvtm_ACTION_ORDER_DELIVERY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iNewOrderId", "iRequestId", "iOrderType"]
,	kvtm_ACTION_ORDER_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentExp", "iOrderId"]
,	kvtm_ACTION_ORDER_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iNewOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_ACTIVE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iRequestId"]
,	kvtm_ACTION_ORDER_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iOrderId", "iRequestId"]
,	kvtm_ACTION_PRIVATE_SHOP_PUT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot", "iRequestClientCoin", "iRequestFee", "iRequestItem", "iRequestNum", "iRequestPriceSell", "bHasAd"]
,	kvtm_ACTION_PRIVATE_SHOP_AD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_GET_MONEY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_PRIVATE_SHOP_UNLOCK_COIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_NEWS_BOARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_PRIVATE_SHOP_FRIEND_BUY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFriendId", "iRequestIdSlot"]
,	kvtm_ACTION_UPDATE_COIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_AIRSHIP_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_AIRSHIP_SKIP_TIME_UNLOCK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_AIRSHIP_SKIP_TIME_INACTIVE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_AIRSHIP_PACK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestIdSlot"]
,	kvtm_ACTION_AIRSHIP_DELIVERY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iCurrentReputation"]
,	kvtm_ACTION_AIRSHIP_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult"]
,	kvtm_ACTION_AIRSHIP_REQUEST_HELP: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iRequestSlotId"]
,	kvtm_ACTION_AIRSHIP_GET: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult"]
,	kvtm_ACTION_AIRSHIP_FRIEND_PACK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFriendId", "iRequestSlotId"]
,	kvtm_ACTION_AIRSHIP_NEWS_BOARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_TOM_HIRE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestType", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "bIsSaleOff"]
,	kvtm_ACTION_TOM_FIND: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestItem", "sRequestSupport", "iMultiple"]
,	kvtm_ACTION_TOM_BUY: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestSlot", "sItemID"]
,	kvtm_ACTION_TOM_CANCEL: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter"]
,	kvtm_ACTION_TOM_REDUCE_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestSupport", "iRequestNum"]
,	kvtm_ACTION_LUCKY_SPIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iRequestClientCoin", "iRequestPriceCoin", "iPrice", "iSpinId", "iSpinX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_LUCKY_SPIN_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iGoldAfter", "iRequestClientCoin", "iWinSlot"]
,	kvtm_ACTION_GET_USER_DATA: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "bLocalPayment"]
,	kvtm_ACTION_MAIL_MARK_READ: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailID"]
,	kvtm_ACTION_MAIL_DELETE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailID"]
,	kvtm_ACTION_MAIL_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sMailID"]
,	kvtm_ACTION_BLACKSMITH_MAKE_POT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sRequestPot", "bForgeSuccess"]
,	kvtm_ACTION_OPEN_BUILDING_GAME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "bIsOpenBuidingGame"]
,	kvtm_ACTION_DICE_SPIN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iDiceId", "iDiceX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_DICE_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iDiceX", "iWinSlot", "sWinItem"]
,	kvtm_ACTION_DECOR_PUT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter","iRequestDecor", "sRequestFloors", "sRequestSlots", "sSlotResult"]
,	kvtm_ACTION_DECOR_STORE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "sRequestFloors", "sRequestSlots", "sSlotResult", "sDecors"]
,	kvtm_ACTION_DAILY_GIFT_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iPos"]
,	kvtm_ACTION_MINE_GET_INFO: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iMineStatus", "mMineRequireItems", "mMineReceiveItems", "sMineFinishTime"]
,	kvtm_ACTION_MINE_START: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iMineStatus", "mMineRequireItems", "mMineReceiveItems", "sMineFinishTime"]
,	kvtm_ACTION_MINE_SKIP_TIME: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iMineStatus", "sMineFinishTime", "iCoinBefore", "iCoinAfter"]
,	kvtm_ACTION_MINE_RECEIVE_REWARDS: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult"]
,	kvtm_ACTION_GACHA_OPEN: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iReputationAfter", "iExpAfter", "sChestId", "sWinItem", "iRequestClientCoin", "iRequestPriceCoin", "iPrice"]
,	kvtm_ACTION_GACHA_GET_REWARD: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "iCoinAfter", "iGoldAfter", "iReputationAfter", "iExpAfter", "sChestId", "sWinItem"]
,	kvtm_ACTION_EVENT_MERGE_PUZZLE: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sEventID", "sPuzzledID", "sMailID"]
,	kvtm_ACTION_EVENT_01_RECEIVE_REWARDS: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sEventID", "mCheckpoint", "mEventPoint", "sMailID"]
,	kvtm_ACTION_PAYMENT_CARD_SUBMIT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sItemID", "sChannel", "sSerial", "sCode"]
,	kvtm_ACTION_PAYMENT_SMS_REG: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sItemID", "sChannel", "iPrice"]
,	kvtm_ACTION_PAYMENT_ATM_REG: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sItemID", "sBankCode", "iPrice"]
,	kvtm_ACTION_PAYMENT_GOOGLE_CHECK: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sItemID"]
,	kvtm_ACTION_PAYMENT_GOOGLE_SUBMIT: ["timestamp", "sUserID", "sServerID", "iLevel", "sTransactionID", "mItemLostList", "mItemReceivedList", "iResult", "sPackageName", "sData", "sSign", "bFinish"]
},	report: {
	ktvm_CACHE_DAILY: ["timestamp", "aActiveUser", "aNewUser", "aPayingUser", "aNewPayingUser"]
,	ktvm_DAILY: ["timestamp", "iA1", "iN1", "iC1", "iRR1", "iPCU", "iACP"]
}
};

module.exports = LOGS;