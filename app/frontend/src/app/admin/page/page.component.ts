import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Admin } from '../../obj/Admin';
import { AdminAuthenService } from '../admin-authen.service';

@Component({
	selector: 'app-admin-page',
	templateUrl: './page.component.html',
	styleUrls: ['./page.component.css']
})

export class AdminPageComponent implements OnInit
{
	private admins: string[];
	private selectAdmin: Admin;
	private newAdmin:string;

	constructor(private adminService: AdminService, private adminAuthen:AdminAuthenService)
	{
		this.admins = [];
		this.selectAdmin = null;
		this.newAdmin = "";
	}

	ngOnInit()
	{
		this.adminService.list ().subscribe (result =>
		{
			if (!result || !result.value)
				return;

			this.admins = result.value;
			this.onSelect (this.admins [0]);
		});
	}

	onLogout ():void
	{
		this.adminAuthen.logout();
	}

	onSelect (domain:string):void
	{
		this.adminService.permissions (domain).subscribe (result =>
		{
			if (!result || !result.value)
				return;
			
			let temp:Admin = result.value;
			this.selectAdmin = temp;
		});
	}

	onAdd ():void
	{
		if (this.newAdmin === "")
			return;

		this.adminService.addAdmin (this.newAdmin).subscribe (result =>
		{
			if (!result || !result.value)
				return;
			
			this.admins.push (result.value);
			this.newAdmin = "";

			this.onSelect (result.value);
		});
	}

	onRemove (target:string):void
	{
		if (target === "")
			return;

		this.adminService.removeAdmin (target).subscribe (result =>
		{
			if (!result || !result.value)
				return;
			
			let i = 0;
			for (; i < this.admins.length; i++)
			{
				let admin:string = this.admins [i];
				if (admin == target)
					break;
			}

			this.admins = this.admins.slice(i - 1, 1);
			if (this.selectAdmin && this.selectAdmin.domain == target)
				this.selectAdmin = null;
		});
	}
}