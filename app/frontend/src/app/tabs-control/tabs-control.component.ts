import { Component, ContentChildren, QueryList, AfterContentInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { DynamicTabsDirective } from './dynamic-tabs.directive';
import { TabPlaceholderComponent } from '../tab-placeholder/tab-placeholder.component';

@Component({
	selector: 'app-tabs-control',
	templateUrl: './tabs-control.component.html',
	styleUrls: ['./tabs-control.component.css']
})
export class TabsControlComponent implements AfterContentInit
{
	dynamicTabs: TabPlaceholderComponent[] = [];

	@ContentChildren(TabPlaceholderComponent) tabs: QueryList<TabPlaceholderComponent>;

	@ViewChild(DynamicTabsDirective) dynamicTabPlaceholder: DynamicTabsDirective;

	constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }

	// contentChildren are set
	ngAfterContentInit()
	{
		// get all active tabs
		const activeTabs = this.tabs.filter(tab => tab.active);

		// if there is no active tab set, activate the first
		if (activeTabs.length === 0)
			this.selectTab(this.tabs.first);
	}

	openTab(title: string, template, data, isCloseable = false)
	{
		// get a component factory for our TabComponent
		const componentFactory = this._componentFactoryResolver.resolveComponentFactory(TabPlaceholderComponent);

		// fetch the view container reference from our anchor directive
		const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

		// alternatively...
		// let viewContainerRef = this.dynamicTabPlaceholder;

		// create a component instance
		const componentRef = viewContainerRef.createComponent(componentFactory);

		// set the according properties on our component instance
		const instance: TabPlaceholderComponent = componentRef.instance as TabPlaceholderComponent;
		instance.title = title;
		instance.template = template;
		instance.dataContext = data;
		instance.isCloseable = isCloseable;

		// remember the dynamic component for rendering the
		// tab navigation headers
		this.dynamicTabs.push(componentRef.instance as TabPlaceholderComponent);

		// set it active
		this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
	}

	selectTab(tab: TabPlaceholderComponent)
	{
		// deactivate all tabs
		this.tabs.toArray().forEach(tab => (tab.active = false));
		this.dynamicTabs.forEach(tab => (tab.active = false));

		// activate the tab the user has clicked on.
		tab.active = true;
	}

	closeTab(tab: TabPlaceholderComponent)
	{
		for (let i = 0; i < this.dynamicTabs.length; i++)
		{
			if (this.dynamicTabs[i] !== tab)
				continue;
			
			// remove the tab from our array
			this.dynamicTabs.splice(i, 1);

			// destroy our dynamically created component again
			let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
			// let viewContainerRef = this.dynamicTabPlaceholder;
			viewContainerRef.remove(i);

			// set tab index to 1st one
			this.selectTab(this.tabs.first);
			break;
		}
	}

	closeActiveTab()
	{
		const activeTabs = this.dynamicTabs.filter(tab => tab.active);
		if (activeTabs.length > 0)
			this.closeTab(activeTabs[0]);
	}
}