export class Admin
{
	readonly domain: string;
	private password: string;
	public name?: string;
	public permission?: string[];

	constructor (domain: string)
	{
		this.domain = domain;
		this.password = "root";
		this.name = domain;
		this.permission = ["admin", "operator", "customer service"];
	}

	public login (pw: string): boolean
	{
		return this.password == pw;
	}
}