import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDeviceComponent } from './dialog-edit-device.component';

describe('DialogEditDeviceComponent', () => {
  let component: DialogEditDeviceComponent;
  let fixture: ComponentFixture<DialogEditDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
