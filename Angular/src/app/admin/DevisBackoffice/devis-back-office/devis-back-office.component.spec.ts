import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisBackOfficeComponent } from './devis-back-office.component';

describe('DevisBackOfficeComponent', () => {
  let component: DevisBackOfficeComponent;
  let fixture: ComponentFixture<DevisBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevisBackOfficeComponent]
    });
    fixture = TestBed.createComponent(DevisBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
