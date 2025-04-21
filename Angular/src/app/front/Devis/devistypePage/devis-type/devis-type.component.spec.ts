import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisTypeComponent } from './devis-type.component';

describe('DevisTypeComponent', () => {
  let component: DevisTypeComponent;
  let fixture: ComponentFixture<DevisTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevisTypeComponent]
    });
    fixture = TestBed.createComponent(DevisTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
