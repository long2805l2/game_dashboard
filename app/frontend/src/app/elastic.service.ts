import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import * as elasticsearch from 'elasticsearch-browser';

@Injectable({
	providedIn: 'root'
})
export class ElasticService
{
	private client: Client;

	constructor()
	{
		if (!this.client)
			this.connect();
	}
 
	private connect()
	{
		this.client = new elasticsearch.Client({
			host: 'http://localhost:9200'
		,	log: 'trace'
		});
	}

	private onPing ():void
	{
		this.client.ping(
		{
			requestTimeout: Infinity,
			body: 'hello JavaSampleApproach!'
		});
	}
	
	public isAvailable(): any
	{
		return this.client.ping({
			requestTimeout: Infinity,
			body: 'hello grokonez!'
		});
	}
}
