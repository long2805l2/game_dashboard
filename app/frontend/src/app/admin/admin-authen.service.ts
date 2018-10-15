import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";
import * as config from "../../../../../config.js";
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AdminAuthenService
{
	constructor(private http: HttpClient)
	{
	}

	public login(domain:string, password:string):Observable<any>
	{
		return this.http.post(config.backend.home + config.backend.login
		,	{
				domain: domain
			,	password: password
			}
		);
    }
	
	public logout():void
	{
		let domain:string = localStorage.getItem("domain");
		let token:string = localStorage.getItem("id_token");
		localStorage.removeItem("domain");
        localStorage.removeItem("id_token");
		localStorage.removeItem("expires_at");
		
		this.http.post(config.backend.logout
		,	{
				domain: domain
			,	token: token
			}
		);
    }

	public setSession(domain:string, token:string, expiresIn:any):void
	{
        const expiresAt = moment().add(expiresIn,'second');
		localStorage.setItem('domain', domain);
		localStorage.setItem('id_token', token);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    }

	public isLoggedIn():boolean
	{
		// this.logout();
        return moment().isBefore(this.getExpiration());
    }

	public isLoggedOut():boolean
	{
        return !this.isLoggedIn();
    }

	public getExpiration():moment.Moment
	{
        const expiration = localStorage.getItem("expires_at");
		const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
	}
	
	public verify (domain: string, token: string):any
	{
		return this.http.post(config.backend.admin
		,	{
				domain: domain
			,	token: token
			}
		);
	}
}
