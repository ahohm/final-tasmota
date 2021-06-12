import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectedDeviceComponent } from './detected-device.component';

describe('DetectedDeviceComponent', () => {
  let component: DetectedDeviceComponent;
  let fixture: ComponentFixture<DetectedDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectedDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectedDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
