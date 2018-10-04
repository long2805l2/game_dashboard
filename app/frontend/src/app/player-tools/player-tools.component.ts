import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlayerService } from '../player.service';

@Component({
	selector: 'app-player-tools',
	templateUrl: './player-tools.component.html',
	styleUrls: ['./player-tools.component.css']
})
export class PlayerToolsComponent implements OnInit
{
	private cmd:string;
	private cmdRequire;
	private cmds:any[];
	private response:any = {};

	private form: FormGroup;

	constructor(private playerService:PlayerService)
	{
		this.cmds = playerService.getCmds();
	}

	ngOnInit()
	{
		this.form = new FormGroup({});
	}
	
	private submit(): void
	{
		let data = this.form.value;
		console.log (this.form);
		this.playerService.sendRequire (this.cmd, data)
		.subscribe (result => {
			if (!result)
			{
				this.response = {error: result};
				return;
			}
			
			this.response = result;
			console.log ("submit " + this.cmd + "\n" + JSON.stringify(data) + "\n" + JSON.stringify (result));
		});
		// .subscribe ({
		// 	next: x => console.log('Observer got a next value: ' + x),
		// 	error: err => console.error('Observer got an error: ' + err),
		// 	complete: () => console.log('Observer got a complete notification'),
		// });
	}

	private onTab (event:MouseEvent, formName: string)
	{
		console.log ("ontab: " + formName);
		this.updateControls (formName);
	}

	private updateControls (formName: string)
	{
		this.cmd = formName;
		this.cmdRequire = this.playerService.getCmdRequire (this.cmd);
		
		let group: any = {};
		for (let id in this.cmdRequire)
		{
			let control:any = this.cmdRequire [id];
			group[id] = new FormControl('', Validators.required);
		}
		
		this.form = new FormGroup(group);
	}
}
