import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServerPageComponent } from './server-page/server-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { CustomerPageComponent } from './customer-page/customer-page.component';
import { PlayerToolsComponent } from './player-tools/player-tools.component';
import { AdminPageComponent } from './admin/page/page.component';
import { AdminProfileComponent } from './admin/profile/profile.component';

const routes: Routes = [
	{path: "admins/accounts", component: AdminPageComponent}
,	{path: "admins/profile", component: AdminProfileComponent}
,	{path: "servers", component: ServerPageComponent}
,	{path: "servers/:id", component: ServerPageComponent}
,	{path: "customerservice", component: CustomerPageComponent, children: [
		{path: "user", component: UserPageComponent}
	,	{path: "user/:id", component: PlayerDetailComponent}
	,	{path: "tools", component: PlayerToolsComponent}
	]}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ]
,	exports: [ RouterModule ]
})

export class AppRoutingModule {}