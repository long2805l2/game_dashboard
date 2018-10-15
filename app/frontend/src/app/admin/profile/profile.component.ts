import { Component, OnInit, Input } from '@angular/core';
import { Admin } from '../../obj/Admin';

@Component({
	selector: 'app-admin-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class AdminProfileComponent implements OnInit
{
	@Input() admin:Admin;
	@Input() isReadonly:boolean;

	constructor()
	{
		this.isReadonly = false;
	}

	ngOnInit()
	{
	}
}