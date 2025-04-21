import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistercalComponent } from './sinistercal.component';

describe('SinistercalComponent', () => {
  let component: SinistercalComponent;
  let fixture: ComponentFixture<SinistercalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinistercalComponent]
    });
    fixture = TestBed.createComponent(SinistercalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
