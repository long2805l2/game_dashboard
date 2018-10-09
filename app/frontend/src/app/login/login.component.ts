import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthenService } from '../admin-authen.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit
{
	private loginForm: FormGroup;
	private domain: string;
	private token: string;

	constructor(private fb:FormBuilder, private authService: AdminAuthenService, private router: Router)
	{
		this.loginForm = this.fb.group({
			domain:		['', Validators.required],
			password:	['', Validators.required]
		});
	}

	ngOnInit()
	{
	}

	private login(): void
	{
		const val = this.loginForm.value;
		if (!val.domain || !val.password)
			return;
		
		this.authService
		.login(val.domain, val.password)
		.subscribe((response) => {
			if (!response)
			{
				console.log("User is logged in false");
				return;
			}
			
			console.log("User is logged in ok");
			console.log(response);

			this.domain = val.domain;
			this.token = response.token;
			this.authService.setSession (this.domain, this.token, response.expiresIn);
			
			//this.router.navigateByUrl(this.router.url);
			window.location.reload();
		});
	}

	private verify(): void
	{
		const val = this.loginForm.value;
		if (!val.domain || !val.password)
			return;
		
		this.authService
		.verify(this.domain, this.token)
		.subscribe((response) => {
			console.log(response);
		});
	}
}
