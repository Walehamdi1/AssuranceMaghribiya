// src/app/contract-crud/contract-crud.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContractCrudComponent } from './contract-crud.component';
import { ContractService } from '../../services/contract.service';

describe('ContractCrudComponent', () => {
  let component: ContractCrudComponent;
  let fixture: ComponentFixture<ContractCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractCrudComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [ ContractService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.contractForm.valid).toBeFalse();
  });

  it('should have a valid form when properly filled', () => {
    // Fill contract-level fields
    component.contractForm.controls['contractNumber'].setValue('CN-001');
    component.contractForm.controls['startDate'].setValue('2025-01-01');
    component.contractForm.controls['endDate'].setValue('2025-12-31');
    component.contractForm.controls['type'].setValue('Auto Insurance');
    component.contractForm.controls['status'].setValue('PENDING');

    // Get the nested property form group
    const propertyGroup = component.contractForm.get('property');
    propertyGroup?.get('address')?.setValue('123 Main St');
    propertyGroup?.get('area')?.setValue(1500);
    propertyGroup?.get('propertyType')?.setValue('RESIDENTIAL');
    propertyGroup?.get('value')?.setValue(250000);

    expect(component.contractForm.valid).toBeTrue();
  });
});
