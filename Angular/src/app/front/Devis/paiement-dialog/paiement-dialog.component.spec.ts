import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementDialogComponent } from './paiement-dialog.component';

describe('PaiementDialogComponent', () => {
  let component: PaiementDialogComponent;
  let fixture: ComponentFixture<PaiementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
