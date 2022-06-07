import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerManagerComponent } from './trainer-manager.component';

describe('TrainerManagerComponent', () => {
  let component: TrainerManagerComponent;
  let fixture: ComponentFixture<TrainerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
