export class Player
{
	readonly raw:any;
	readonly detail:any;

	constructor (raw:any)
	{
		this.raw = raw;
		raw = raw.data;

		let temp:any = {};
		temp.info = {
			UserId: raw.uBrief.userId
		,	UserName: raw.uBrief.username
		,	DatabaseID: raw.uBrief.bucketId
		,	RegisterDate: raw.uBrief.timeRegister
		,	Level: raw.uGame.level
		,	Exp: raw.uGame.exp
		,	Gold: raw.uGame.gold
		,	Reputation: raw.uGame.reputation
		,	Coin: raw.uGame.coin
		,	CoinBonus: 0
		};

		temp.active = {
			Status: raw.uOnline ? "Online serverId + sessionId" : "Offline"
		,	LastLoginAt: raw.uBrief.timeLogin + " (0 Days 0 Hours 0 Minutes 0 Seconds ago)"
		,	LastIP: "xxx.xxx.xxx.xxx"
		};

		temp.device = {
			IMEI: raw.uBrief.deviceId
		,	Name: "device name"
		,	Platform: "OS-version"
		};

		temp.sns = {
			FacebookId: "http://www.facebook.com/xxxxxxxxxxxxxxx"
		,	FacebookName: "Facebook Name"
		};

		temp.inbox = raw.uMailbox;

		temp.stocks = {
			level: raw.uGame.stockLevel
		,	items: raw.uGame.stock
		};

		temp.floors = [];
		temp.machines = [];
		for (let i in raw.uGame.floors)
		{
			let floor = raw.uGame.floors[i];
			
			temp.floors [i] = [];
			for (let s in floor.slots)
			{
				let slot = floor.slots [s];
				temp.floors [i][s] = [
					slot.pot
				,	slot.plant
				,	"null"
				];
			}

			temp.machines [i] = {
				Name: "machine " + i
			,	Floor: i
			,	Level: floor.machine.level
			,	Product: floor.machine.produceItems
			,	Stock: floor.machine.store
			};
		}
		
		this.detail = temp;
	}
}