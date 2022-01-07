import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherValidatorComponent } from './other-validator.component';

describe('OtherValidatorComponent', () => {
  let component: OtherValidatorComponent;
  let fixture: ComponentFixture<OtherValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherValidatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
