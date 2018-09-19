import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";
import { Observable } from 'rxjs';
import { Admin } from './obj/Admin';

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
		return this.http.post('http://localhost:4201/api/admin/authen'
		,	{
				domain: domain
			,	password: password
			}
		);
    }
	
	public logout():void
	{
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

	public setSession(token, expiresIn):void
	{
        const expiresAt = moment().add(expiresIn,'second');
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
		return this.http.post('http://localhost:4201/api/admin/list'
		,	{
				domain: domain
			,	token: token
			}
		);
	}
}
