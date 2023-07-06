import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectChangeSignTableComponent } from './collect-change-sign-table.component';

describe('CollectChangeSignTableComponent', () => {
  let component: CollectChangeSignTableComponent;
  let fixture: ComponentFixture<CollectChangeSignTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectChangeSignTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectChangeSignTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
