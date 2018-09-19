import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElasticPageComponent } from './elastic-page.component';

describe('ElasticPageComponent', () => {
  let component: ElasticPageComponent;
  let fixture: ComponentFixture<ElasticPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElasticPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElasticPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
