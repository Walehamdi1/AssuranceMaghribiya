import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContractComponent } from './list-contract.component';

describe('ListContractComponent', () => {
  let component: ListContractComponent;
  let fixture: ComponentFixture<ListContractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListContractComponent]
    });
    fixture = TestBed.createComponent(ListContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});