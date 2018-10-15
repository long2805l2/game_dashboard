import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Admin } from '../obj/Admin';
import { BackendService } from '../backend.service';
import * as config from '../../../../../config.js';
@Injectable({
	providedIn: 'root'
})

export class AdminService
{
	private admins:Admin[] = [];
	
	constructor(protected backend:BackendService)
	{
	}

	public list(): Observable<any>
	{
		let callback = (value) =>
		{
			let list:string[] = value ['list'];
			if (!list)
				return [];

			let temp:string[] = [];
			for (let i = 0; i < list.length; i++)
				temp[i] = list [i];

			return temp;
		};
		
		return this.backend.sendRequest (config.backend.admin, "list", {}, callback);
	}

	public addAdmin (target:string): Observable<any>
	{
		let callback = (value) =>
		{
			let target:string = value ['target'];
			if (!target)
				return null;

			return target;
		};

		return this.backend.sendRequest (config.backend.admin, "add", {target: target}, callback);
	}

	public removeAdmin (target:string): Observable<any>
	{
		let callback = (value) =>
		{
			return true;
		};

		return this.backend.sendRequest (config.backend.admin, "remove", {target: target}, callback);
	}

	public permissions (target:string): Observable<any>
	{
		let callback = (value) =>
		{
			if (!value)
				return false;

			let admin:Admin = new Admin (value.target, value.permissions);
			return admin;
		};

		return this.backend.sendRequest (config.backend.admin, "permissions", {target: target}, callback);
	}

	public permission (target:string, cmd:string, value:boolean): Observable<any>
	{
		let callback = (value) =>
		{
			if (!value)
				return false;

			let admin:Admin = new Admin (value.target, value.permissions);
			return admin;
		};
		
		return this.backend.sendRequest (config.backend.admin, "permission", {target: target, cmd:cmd, value:value}, callback);
	}
}