import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player } from './obj/Player';
import * as CryptoJS from 'crypto-js';

const HTTP_OPTION: any = {
	headers: new HttpHeaders({
		'Content-Type': 'text/plain; charset=UTF-8'
	})
};

// const USER_BACKEND_URL:string = "http://localhost:8101/";
const USER_BACKEND_URL: string = "http://49.213.72.182:8010/";

const ADMIN_KEY: string = "(@dm1nS#cr3tKey!)";

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
export class PlayerService {
	constructor(private http: HttpClient) { }

	public getCmds(): any[] {
		let cmds: any[] = [];
		for (let cmd in CMDS)
			cmds.push({
				cmd: cmd
				, display: CMDS[cmd].display
			});

		return cmds;
	}

	public getCmdRequire(cmd: string) {
		let detail = CMDS[cmd];
		if (detail == null)
			return {};

		return detail.require;
	}

	public getPlayer(type: string, param: string): Observable<Player> {
		// this.http
		// .get(this.url + param)
		// .pipe(
		// 	map((value, index) => this.onParsePlayer(value, index))
		// )
		// .subscribe(
		// 	data => this.onNext (data)
		// ,	error => this.onError (error)
		// ,	() => this.onComplete()
		// );

		return this.http
			.get("http://49.213.72.182/kvtm/view.php?userId=" + param)
			.pipe(
				map((value, index) => this.onParsePlayer(value, index))
				, catchError((error) => this.onError(error))
			);
	}

	private onParsePlayer(value: Object, index: number): Player {
		console.log(index);
		console.log(value);

		if (value['error']) {
			console.log(value['error']);
			return null;
		}

		let player: Player = new Player(value);
		return player;
	}

	public sendRequire(cmdId: string, data: any): Observable<any> {
		console.log("sendRequire: " + cmdId);
		console.log("data: " + JSON.stringify(data));
		let cmd = CMDS[cmdId];
		if (!cmd)
			return of(false);

		let require: any = {};
		require.admin = "longph";
		require.time = Math.round(new Date().getTime() * 0.001);

		// data = { "userId": 1538376651, "reason": "send test mail", "type": 0, "uid": 0, "title": "Test mail", "content": "Test mail content", "timeStart": "2018-10-03T16:42", "timeFinish": "2018-10-03T16:50", "items": "" };
		require.data = data;

		let inputHash = ADMIN_KEY + require.admin + require.time + JSON.stringify(data);
		require.hash = CryptoJS.SHA256(inputHash).toString(CryptoJS.enc.Hex);

		let json: string = JSON.stringify(require);

		return this.http
			.post(USER_BACKEND_URL + cmd.url, json, HTTP_OPTION)
			.pipe(
				map((value, index) => this.onResponce(cmdId, value, index))
				, catchError((error) => this.onError(error))
			);
	}

	private onResponce(cmdId: String, value: Object, index: number): any {
		console.log("onResponce: " + cmdId + ", value: " + value + ", index: " + index);
		return value;
	}

	private onError(error: any) {
		const msg = `${error.status} ${error.statusText} -  ${error.url}`;
		console.log("onError: " + msg);

		return throwError(new Error(msg));
	}
}
