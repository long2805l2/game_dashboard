import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Player } from '../obj/Player';
import { PlayerService } from '../player.service';

@Component({
	selector: 'app-user-page',
	templateUrl: './user-page.component.html',
	styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit
{
	readonly searchMethods:any = [
		{id: "playerid",	display: "Player Id"}
	,	{id: "playername",	display: "Player Name"}
	,	{id: "facebookid",	display: "Facebook Id"}
	,	{id: "deviceid",	display: "Device Id"}
	];

	private search: FormGroup;
	private searchMethod:string;
	private searchValue:string;

	private player:Player;

	constructor(private fb:FormBuilder, private playerService:PlayerService)
	{
		this.search = this.fb.group({
			searchMethod:	[this.searchMethods[0].id, Validators.required]
		,	searchValue:	['1538376651', Validators.required]
		});

		this.player = null;
	}

	ngOnInit()
	{
	}

	private onSearch (event)
	{
		const val = this.search.value;
		if (!val.searchMethod || !val.searchValue)
		{
			this.player = null;
			return;
		}

		this.playerService
		.getPlayer(val.searchMethod, val.searchValue)
		.subscribe(
			result => this.onNext (result)
		,	error => this.onError (error)
		,	() => this.onComplete()
		);
	}

	private onNext (result:any):void
	{
		console.log ("onNext", result);
		if (!result || !result.value)
			return;
		
		this.player = result.value;
	}

	private onError (error:any):void
	{
		console.log ("onError", error);
	}

	private onComplete ():void
	{
		console.log ("onComplete");
	}
}
