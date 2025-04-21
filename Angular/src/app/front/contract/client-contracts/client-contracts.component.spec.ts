import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContractsComponent } from './client-contracts.component';

describe('ClientContractsComponent', () => {
  let component: ClientContractsComponent;
  let fixture: ComponentFixture<ClientContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientContractsComponent]
    });
    fixture = TestBed.createComponent(ClientContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
