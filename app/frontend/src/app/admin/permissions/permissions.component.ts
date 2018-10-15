import { Component, OnInit, Input } from '@angular/core';
import { Admin } from 'src/app/obj/Admin';
import { AdminService } from '../admin.service';

@Component({
	selector: 'app-admin-permissions',
	templateUrl: './permissions.component.html',
	styleUrls: ['./permissions.component.css']
})
export class AdminPermissionsComponent implements OnInit
{
	@Input() admin:Admin;
	@Input() isReadonly:boolean;

	private newPermission:string = "";

	constructor(private adminService:AdminService)
	{
		this.isReadonly = false;
	}

	ngOnInit()
	{
	}

	private onAddPermission ()
	{
		this.adminService.permission (this.admin.domain, this.newPermission, true)
		.subscribe (result =>
		{
			if (!result || !result['value'])
				return;

			let admin:Admin = result.value;
			if (this.admin.domain === admin.domain)
				this.admin.permissions = admin.permissions;
		});
	}

	private onRemovePermission ()
	{
		this.adminService.permission (this.admin.domain, this.newPermission, false)
		.subscribe (result =>
		{
			if (!result || !result['value'])
				return;
			
			let admin:Admin = result.value;
			if (this.admin.domain === admin.domain)
				this.admin.permissions = admin.permissions;
		});
	}
}
