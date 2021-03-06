export class Admin
{
	readonly domain: string;
	public permissions?: any;

	constructor (domain: string, permissions?:any)
	{
		this.domain = domain;
		this.permissions = permissions ? permissions : {
		//	"admin_password": true
		// ,	"admin_permissions": true
		// ,	"admin_list": true
		// ,	"admin_add": true
		// ,	"admin_remove": true
		// ,	"admin_permission": true
		// ,	"player_getUserData": true
		};
	}

	public check (permission:string):boolean
	{
		let check = this.permissions ? (permission in this.permissions ? this.permissions[permission] : false) : false;

		return check;
	}
}