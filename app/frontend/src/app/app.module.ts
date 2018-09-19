import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ServerPageComponent } from './server-page/server-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MonitorPageComponent } from './monitor-page/monitor-page.component';
import { OperatorPageComponent } from './operator-page/operator-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { ElasticPageComponent } from './elastic-page/elastic-page.component';
import { CustomerPageComponent } from './customer-page/customer-page.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		ServerPageComponent,
		UserPageComponent,
		AdminPageComponent,
		MonitorPageComponent,
		OperatorPageComponent,
		HomePageComponent,
		AdminDetailComponent,
		PlayerDetailComponent,
		ElasticPageComponent,
		CustomerPageComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
        ReactiveFormsModule,
		AppRoutingModule,
		NgxJsonViewerModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
