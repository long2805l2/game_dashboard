import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-tab-placeholder',
	templateUrl: './tab-placeholder.component.html',
	styleUrls: ['./tab-placeholder.component.css']
})
export class TabPlaceholderComponent implements OnInit
{
	@Input('tabTitle') title: string;
	@Input() active = false;
	@Input() isCloseable = false;
	@Input() template;
	@Input() dataContext;

	constructor() { }

	ngOnInit() {
	}

}
