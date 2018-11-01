import { Component, OnInit } from '@angular/core';
import { AdminAuthenService } from '../admin/admin-authen.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit
{
	private domain:string;

	constructor(private adminAuthen:AdminAuthenService)
	{
		this.domain = localStorage.getItem("domain");
	}

	ngOnInit()
	{
	}
	
	private onLogout ():void
	{
		this.adminAuthen.logout();
	}
}
