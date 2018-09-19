import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../obj/Player';
import { PlayerService } from '../player.service';

@Component({
	selector: 'app-player-detail',
	templateUrl: './player-detail.component.html',
	styleUrls: ['./player-detail.component.css']
})

export class PlayerDetailComponent implements OnInit
{
	@Input() player:Player;
	private playerInfo:any[];
	private floors:any;
	private stocks:any;
	private machines:any;
	
	constructor()
	{
	}

	ngOnInit()
	{
		if (!this.player)
			this.player = new Player ({});
		
		this.playerInfo = [
			{display: "Info", obj: this.player.detail.info}
		,	{display: "Active", obj: this.player.detail.active}
		,	{display: "Device", obj: this.player.detail.device}
		,	{display: "SNS", obj: this.player.detail.sns}
		];
		this.floors = this.player.detail.floors;
		this.stocks = this.player.detail.stocks;
		this.machines = this.player.detail.machines;
	}

	private onTab (event:MouseEvent, formName: string)
	{
		let i;
		let tabcontent;
		let tablinks;
		
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++)
			tabcontent[i].className = "tabhide";
	
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++)
			tablinks[i].className = tablinks[i].className.replace(" active", "");
	
		document.getElementById(formName).className = "tabcontent";
		event.srcElement.className += " active";
	}
}
