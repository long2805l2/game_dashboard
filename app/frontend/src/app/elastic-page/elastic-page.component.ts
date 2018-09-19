import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElasticService } from '../elastic.service';

@Component({
	selector: 'app-elastic-page',
	templateUrl: './elastic-page.component.html',
	styleUrls: ['./elastic-page.component.css']
})
export class ElasticPageComponent implements OnInit
{
	private isConnected:boolean = false;
	private status:string;
   
	constructor(private es: ElasticService, private cd: ChangeDetectorRef)
	{
		this.isConnected = false;
	}
   
	ngOnInit()
	{
		this.es.isAvailable().then(() => {
			this.status = 'OK';
			this.isConnected = true;
		}, error => {
			this.status = 'ERROR';
			this.isConnected = false;
			console.error('Server is down', error);
		}).then(() => {
			this.cd.detectChanges();
		});
	}
}
