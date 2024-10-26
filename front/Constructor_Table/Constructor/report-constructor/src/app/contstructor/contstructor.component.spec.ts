import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContstructorComponent } from './contstructor.component';

describe('ContstructorComponent', () => {
  let component: ContstructorComponent;
  let fixture: ComponentFixture<ContstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
