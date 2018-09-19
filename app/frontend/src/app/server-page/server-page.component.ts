import { Component, OnInit } from '@angular/core';
import { Server } from '../obj/Server';

@Component({
	selector: 'app-server-page',
	templateUrl: './server-page.component.html',
	styleUrls: ['./server-page.component.css']
})
export class ServerPageComponent implements OnInit
{
	readonly servers: Server[];

	private selected: Server[];
	private canStop:boolean;
	private canPause:boolean;
	private canSync:boolean;

	constructor()
	{
		this.servers = [
			new Server ("10.30.81.46", 8305, "run", ["skygarden_server_release_0.0.1.jar", "db.xls v1158", "minigame.xls v1189"])
		,	new Server ("10.30.81.46", 8300, "pause", ["skygarden_server_release_0.0.1.jar", "db.xls v1153", "minigame.xls v1183"])
		,	new Server ("10.30.81.52", 8305, "run", ["skygarden_server_release_0.0.1.jar", "db.xls v1158", "minigame.xls v1189"])
		,	new Server ("10.30.81.52", 8300, "pause", ["skygarden_server_release_0.0.1.jar", "db.xls v1153", "minigame.xls v1183"])
		];

		this.selected = [];
		this.canStop = false;
		this.canPause = false;
		this.canSync = false;
	}

	ngOnInit()
	{
	}

	private onCheck (event):void
	{
		this.selected = [];
		this.canStop = true;
		this.canPause = true;
		this.canSync = true;

		for (let id in this.servers)
		{
			let server:Server = this.servers[id];
			if (server.isCheck == undefined || server.isCheck == false)
				continue;

			this.selected.push (server);
			this.canStop = this.canStop && server.canStop();
			this.canPause = this.canPause && server.canPause();
		}

		if (this.selected.length == 0)
		{
			this.canStop = false;
			this.canPause = false;
			this.canSync = false;
		}
	}
}
