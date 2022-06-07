import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracerStudyComponent } from './tracer-study.component';

describe('TracerStudyComponent', () => {
  let component: TracerStudyComponent;
  let fixture: ComponentFixture<TracerStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracerStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracerStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
