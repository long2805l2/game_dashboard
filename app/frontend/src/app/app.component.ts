import { Component } from '@angular/core';
import { AdminAuthenService } from './admin/admin-authen.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent
{
	private isLogin: boolean;

	constructor(private auth: AdminAuthenService)
	{
		this.isLogin = auth.isLoggedIn();
	}
}
