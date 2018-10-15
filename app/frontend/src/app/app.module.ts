import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/login/login.component';
import { AdminPageComponent } from './admin/page/page.component';
import { AdminProfileComponent } from './admin/profile/profile.component';
import { AdminPermissionsComponent } from './admin/permissions/permissions.component';
import { ServerPageComponent } from './server-page/server-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { MonitorPageComponent } from './monitor-page/monitor-page.component';
import { OperatorPageComponent } from './operator-page/operator-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { CustomerPageComponent } from './customer-page/customer-page.component';
import { PlayerToolsComponent } from './player-tools/player-tools.component';

@NgModule({
	declarations: [
		AppComponent,
		AdminLoginComponent,
		AdminPageComponent,
		AdminProfileComponent,
		AdminPermissionsComponent,
		
		ServerPageComponent,
		UserPageComponent,
		MonitorPageComponent,
		OperatorPageComponent,
		HomePageComponent,
		PlayerDetailComponent,
		CustomerPageComponent,
		PlayerToolsComponent
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
