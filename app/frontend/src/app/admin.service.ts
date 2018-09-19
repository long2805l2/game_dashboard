import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Admin } from './obj/Admin';

const Admins: Admin[] = [
	new Admin ("longph")
,	new Admin ("thuanvt")
,	new Admin ("huong")
];

@Injectable({
	providedIn: 'root'
})

export class AdminService
{
	constructor() { }

	public getAdmins(): Observable<Admin []>
	{
		return of (Admins);
	}

	public getAdmin(domain: string): Observable<Admin>
	{
		let admin: Admin = null;
		Admins.forEach(ad => {
			if (ad.domain == domain)
				admin = ad;
		});
		
		return of (admin);
	}
}