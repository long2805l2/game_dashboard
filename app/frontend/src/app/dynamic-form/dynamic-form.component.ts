import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ControlDetail } from './control-detail';
import { Textbox } from './textbox';

@Component({
	selector: 'app-dynamic-form',
	templateUrl: './dynamic-form.component.html',
	styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit
{
	@Input() controls:any;
	private form: FormGroup;
	
	constructor(private fb:FormBuilder)
	{
	}

	ngOnInit()
	{
		this.setFields ({});
	}

	public getValues ():any
	{
		return this.form.value;
	}
	
	public setFields (controls:any)
	{
		let group: any = {};
		this.controls = controls;
		for (let id in this.controls)
		{
			let control:any = this.controls [id];
			group[id] = new FormControl('', Validators.required);
		}
		
		this.form = new FormGroup(group);
	}
}
