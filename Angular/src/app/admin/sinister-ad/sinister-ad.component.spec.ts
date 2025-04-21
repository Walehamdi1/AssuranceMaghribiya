import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinisterADComponent } from './sinister-ad.component';

describe('SinisterADComponent', () => {
  let component: SinisterADComponent;
  let fixture: ComponentFixture<SinisterADComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinisterADComponent]
    });
    fixture = TestBed.createComponent(SinisterADComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
