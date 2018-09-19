import { Component, OnInit } from '@angular/core';
import { Admin } from '../obj/Admin';
import { AdminService } from '../admin.service';

@Component({
	selector: 'app-admin-page',
	templateUrl: './admin-page.component.html',
	styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit
{
	private admins: Admin[];
	private selectAdmin: Admin;
	private adminService: AdminService;

	constructor(adminService: AdminService)
	{
		this.admins = [];
		this.selectAdmin = null;
		this.adminService = adminService;
	}

	ngOnInit()
	{
		this.adminService
		.getAdmins ()
		.subscribe (list => this.admins = list);
	}

	onSelect (admin: Admin):void
	{
		console.log ("onSelect: " + admin.domain);
		this.selectAdmin = admin;
	}
}