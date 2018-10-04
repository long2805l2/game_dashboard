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
		,	searchValue:	['', Validators.required]
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
			player => this.onNext (player)
		,	error => this.onError (error)
		,	() => this.onComplete()
		)
	}

	private onNext (player:Player):void
	{
		console.log ("onNext");
		console.log (player);
		this.player = player;
	}

	private onError (error:any):void
	{
		console.log ("onError");
		console.log (error);
	}

	private onComplete ():void
	{
		console.log ("onComplete");
	}
}
