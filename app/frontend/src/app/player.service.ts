import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player } from './obj/Player';
import * as config from '../../../../config.js';
import { BackendService } from './backend.service';

const HTTP_OPTION: any = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

const PLAYER_API:string = config.backend.player;

const CMDS: any = {
	getUserData: {
		url: "getUserData"
		, display: "Get User Data"
		, require: {
			userId: "number"
			, useFile: "boolean"
		}
	}
	, setUserGame: {
		url: "setUserGame"
		, display: "Set User Game"
		, require: {
			userId: "number"
			, reason: "string"
			, level: "number"
			, exp: "number"
			, addItems: "item"
			, removeItems: "item"
		}
	}
	, updateUserCoin: {
		url: "updateUserCoin"
		, display: "Update User Coin"
		, require: {
			userId: "number"
			, reason: "string"
			, coin: "number"
		}
	}
	, mapDeviceId: {
		url: "mapDeviceId"
		, display: "Map Device Id"
		, require: {
			userId: "number"
			, toUserId: "number"
		}
	}
	, banUser: {
		url: "banUser"
		, display: "Ban User"
		, require: {
			userId: "number"
			, reason: "string"
			, duration: "time.seconds"
		}
	}
	, unbanUser: {
		url: "unbanUser"
		, display: "Unban User"
		, require: {
			userId: "number"
			, reason: "string"
		}
	}
	// ,	getMailManager: {
	// 		url: "getMailManager"
	// 	,	display: "Get Mail Manager"
	// 	}
	// ,	addSystemMail: {
	// 		url: "addSystemMail"
	// 	,	display: "Add System Mail"
	// 	,	require: {
	// 			reason: "string"
	// 		,	type: "number"
	// 		,	uid: "number"
	// 		,	title: "string"
	// 		,	content: "string"
	// 		,	timeStart: "date"
	// 		,	timeFinish: "date"
	// 		}
	// 	}
	, addPrivateMail: {
		url: "addPrivateMail"
		, display: "Add Private Mail"
		, require: {
			userId: "number"
			, reason: "string"
			, type: "number"
			, uid: "number"
			, title: "string"
			, content: "string"
			, timeStart: "date"
			, timeFinish: "date"
			, items: "item"
		}
	}
};

@Injectable({
	providedIn: 'root'
})
export class PlayerService 
{
	constructor(protected backend: BackendService)
	{
	}

	public getCmds(): any[]
	{
		let cmds: any[] = [];
		for (let cmd in CMDS)
			cmds.push({
				cmd: cmd
			,	display: CMDS[cmd].display
			});

		return cmds;
	}

	public getCmdRequire(cmd: string)
	{
		let detail = CMDS[cmd];
		if (detail == null)
			return {};

		return detail.require;
	}

	public getPlayer(type: string, param: string): Observable<Player>
	{
		return this.sendRequire ("getUserData", {userId: param, useFile: false}, this.onParsePlayer);
	}

	private onParsePlayer(value: Object): Player
	{
		console.log(value);
		let player: Player = new Player(value);
		return player;
	}

	public sendRequire(cmdId: string, data: any, callback:any): Observable<any>
	{
		let cmd = CMDS[cmdId];
		if (!cmd)
			return of(false);

		let detail:any = this.getCmdRequire (cmdId);
		let dataTemp = {};
		for (let field in detail)
		{
			let value:string = data [field];
			let type:string = detail [field];
			let newValue = this.convertData (value, type);
			dataTemp [field] = newValue;
		}

		return this.backend.sendRequest (PLAYER_API, cmdId, dataTemp, callback);
	}

	private getDefautValue (type:string):any
	{
		switch (type)
		{
			case "number":	return -1;
			case "boolean":	return false;
			case "item":	return {};
			default:		return "";
		}
	}

	private convertData (value:any, type:string):any
	{
		let newValue = this.getDefautValue (type);

		if (value === "" || value == null || value == undefined)
			return newValue;
		
		switch (type)
		{
			case "item":
			{
				let temp:string[] = value.split("\n");
				for (let i = 0; i < temp.length; i ++)
				{
					let item:string[] = temp [i].split (":");
					if (item.length != 2)
						continue;

					newValue[item[0]] = Number (item[1]);
				}
				break;
			}
			case "number":	newValue = Number (value); break;
			case "boolean":	newValue = (value === "true" || value === true || value === 1) ? true : false; break;
			default: newValue = value; break;
		}

		return newValue;
	}
}
