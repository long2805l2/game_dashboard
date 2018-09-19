export class Server
{
	readonly name: string;

	readonly ip: string;
	readonly port: number;

	readonly status: string;
	readonly version: string[];

	public isCheck?: boolean;

	constructor (ip: string, port: number, status: string, version: string[])
	{
		this.ip = ip;
		this.port = port;
		this.name = ip + ":" + port;
		this.status = status;
		this.version = version;
		this.isCheck = false;
	}

	public canStop ():boolean
	{
		return this.status === "run";
	}

	public canPause ():boolean
	{
		return this.status !== "pause";
	}
}