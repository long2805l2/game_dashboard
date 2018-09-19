import { Component, OnInit, Input } from '@angular/core';
import { Admin } from '../obj/Admin';

@Component({
	selector: 'app-admin-detail',
	templateUrl: './admin-detail.component.html',
	styleUrls: ['./admin-detail.component.css']
})
export class AdminDetailComponent implements OnInit
{
	@Input() admin: Admin;

	constructor()
	{
	}

	ngOnInit()
	{
	}
}