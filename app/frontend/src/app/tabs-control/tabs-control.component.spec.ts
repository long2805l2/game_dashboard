import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsControlComponent } from './tabs-control.component';

describe('TabsControlComponent', () => {
  let component: TabsControlComponent;
  let fixture: ComponentFixture<TabsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
