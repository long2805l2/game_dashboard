import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { ServerPageComponent } from './server-page/server-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { ElasticPageComponent } from './elastic-page/elastic-page.component';
import { CustomerPageComponent } from './customer-page/customer-page.component';
import { PlayerToolsComponent } from './player-tools/player-tools.component';

const routes: Routes = [
	{path: "admins", component: AdminPageComponent}
,	{path: "admins/:domain", component: AdminDetailComponent}
,	{path: "servers", component: ServerPageComponent}
,	{path: "servers/:id", component: ServerPageComponent}
,	{path: "customerservice", component: CustomerPageComponent, children: [
		{path: "user", component: UserPageComponent}
	,	{path: "user/:id", component: PlayerDetailComponent}
	,	{path: "tools", component: PlayerToolsComponent}
	]}
,	{path: "elastic", component: ElasticPageComponent}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ]
,	exports: [ RouterModule ]
})

export class AppRoutingModule {}