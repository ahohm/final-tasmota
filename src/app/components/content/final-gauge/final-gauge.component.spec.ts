import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalGaugeComponent } from './final-gauge.component';

describe('FinalGaugeComponent', () => {
  let component: FinalGaugeComponent;
  let fixture: ComponentFixture<FinalGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
