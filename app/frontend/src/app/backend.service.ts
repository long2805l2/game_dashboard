import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import * as config from '../../../../config.js';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class BackendService
{
	constructor(protected http: HttpClient) { }

	public sendRequest (api:string, cmd:string, data:any, parser:any):Observable<any>
	{
		console.log ("BackendService", "sendRequest", api, cmd);

		let sendData = {
			domain: localStorage.getItem ("domain")
		,	token: localStorage.getItem ("id_token")
		,	cmd: cmd
		,	data: data
		};

		console.log ("BackendService", "sendData", sendData);

		let HTTP_OPTION:any = {
			headers: new HttpHeaders({
				'Content-Type': "application/json" 
			})
		};

		return this.http
		.post (config.backend.home + api, sendData, HTTP_OPTION)
		.pipe(
			map (result => this.onResponce (cmd, result, parser))
		,	catchError((error) => this.onError(error))
		);
	}

	protected onResponce(cmdId: String, result:any, parser):Observable<any>
	{
		console.log("BackendService", "onResponce", cmdId, result);
		if (!result)
			return throwError(new Error(cmdId + " response is null"));
		
		if (result ['error'])
			return throwError(new Error(cmdId + ": " + result['error']));
		
		if (parser)
			return of (parser (result));
	}

	protected onChunk(cmdId: String, value: Object, index: number): any
	{
		console.log("BackendService", "onChunk", cmdId, value, index);
		return value;
	}

	protected onError(error: any)
	{
		console.log("BackendService", "onError", error);
		const msg = `${error.status} ${error.statusText} -  ${error.url}`;

		return throwError(new Error(msg));
	}
}
