export class Player
{
	readonly raw:any;
	readonly detail:any;

	constructor (raw:any)
	{
		this.raw = raw;

		let temp:any = {};
		temp.info = {
			UserId: raw.userId
		,	UserName: "UserName"
		,	DatabaseID: 9
		,	RegisterDate: "yyyy-mm-dd hh:mm:ss"
		,	Level: raw.level
		,	Exp: raw.exp
		,	Gold: raw.gold
		,	Reputation: raw.reputation
		,	Coin: raw.coin
		,	CoinBonus: 0
		};

		temp.active = {
			Status: "Offline | Online serverId + sessionId"
		,	LastLoginAt: "yyyy-mm-dd hh:mm:ss (0 Days 0 Hours 0 Minutes 0 Seconds ago)"
		,	LastIP: "xxx.xxx.xxx.xxx"
		};

		temp.device = {
			IMEI: "IMEI"
		,	Name: "device name"
		,	Platform: "OS-version"
		};

		temp.sns = {
			FacebookId: "http://www.facebook.com/xxxxxxxxxxxxxxx"
		,	FacebookName: "Facebook Name"
		};

		temp.inbox = {
			0: {
				SentDate: "yyyy-mm-dd hh:mm:ss"
			,	Title: "Title"
			,	Description: "Description"
			,	Item: ["item name:number", "item name:number", "item name:number"]
			,	Status: "Unopened | Open"
			}
		};

		temp.stocks = {
			level: raw.stockLevel
		,	items: raw.stock
		};

		temp.floors = [];
		temp.machines = [];
		for (let i in raw.floors)
		{
			let floor = raw.floors[i];
			
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