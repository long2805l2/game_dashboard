import { ControlDetail } from './control-detail';

export class Textbox extends ControlDetail<string>
{
	public controlType = 'textbox';
	public type: string;

	constructor(options: {} = {})
	{
		super(options);
		this.type = options['type'] || '';
	}
}