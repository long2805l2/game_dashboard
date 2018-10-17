import { Component, OnInit, Input } from '@angular/core';
import { Admin } from '../../obj/Admin';
import { AdminService } from '../admin.service';
import { AdminAuthenService } from '../admin-authen.service';

@Component({
	selector: 'app-admin-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class AdminProfileComponent implements OnInit
{
	private domain:string = null;
	private admin:Admin = null;
	private oldPass:string = "";
	private newPass:string = "";

	constructor(private adminService:AdminService, private adminAuthen:AdminAuthenService)
	{
		this.domain = localStorage.getItem("domain");
	}

	ngOnInit()
	{
		this.adminService.permissions (this.domain).subscribe (result =>
		{
			if (!result || !result.value)
				return;
			
			let temp:Admin = result.value;
			this.admin = temp;
		});
	}
	
	private onLogout ():void
	{
		this.adminAuthen.logout();
		window.location.reload();
	}

	private onChangePassword():void
	{
		if (this.oldPass === "")
			return;
		
		if (this.newPass === "")
			return;

		this.adminService.password (this.newPass, this.newPass).subscribe (result =>
		{
			if (!result || !result.value)
				return;

			console.log ("need logout", result.value, typeof (result.value));
			if (result.value === true)
				this.onLogout ();
		});
	}
}