import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerHijriComponent } from './date-picker-hijri.component';

describe('DatePickerHijriComponent', () => {
  let component: DatePickerHijriComponent;
  let fixture: ComponentFixture<DatePickerHijriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePickerHijriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerHijriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
