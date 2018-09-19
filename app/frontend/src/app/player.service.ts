import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player } from './obj/Player';

@Injectable({
	providedIn: 'root'
})
export class PlayerService
{
	readonly url: string = "http://49.213.72.182/kvtm/view.php?userId=";

	constructor(private http: HttpClient) { }

	public getPlayer (type:string, param:string):Observable<Player>
	{
		// this.http
		// .get(this.url + param)
		// .pipe(
		// 	map((value, index) => this.onParsePlayer(value, index))
		// )
		// .subscribe(
		// 	data => this.onNext (data)
		// ,	error => this.onError (error)
		// ,	() => this.onComplete()
		// );

		return this.http
		.get(this.url + param)
		.pipe(
			map((value, index) => this.onParsePlayer(value, index))
		,	catchError ((error) => this.onError(error))
		);
	}

	private onParsePlayer (value:Object, index:number):Player
	{
		console.log (index);
		console.log (value);

		if (value['error'])
		{
			console.log (value['error']);
			return null;
		}

		let player:Player = new Player (value);
		return player;
	}

	private onError (error: any) 
	{
		const msg = `${error.status} ${error.statusText} -  ${error.url}`;
		return throwError(new Error(msg));
	}
}
