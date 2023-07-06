import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectStraySignComponent } from './collect-stray-sign.component';

describe('CollectStraySignComponent', () => {
  let component: CollectStraySignComponent;
  let fixture: ComponentFixture<CollectStraySignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectStraySignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectStraySignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
