import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateContractComponent } from './create-contract.component';
import { ContractService } from 'src/app/services/contract.service'; // Adjust path as needed

describe('CreateContractComponent', () => {
  let component: CreateContractComponent;
  let fixture: ComponentFixture<CreateContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateContractComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [ ContractService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    // Because we set default values like contractNumber = 'CNT-' or status = 'PENDING',
    // check if the form is valid only if user has filled the rest.
    expect(component.contractForm.valid).toBeFalse();
  });

  it('should have a valid form when properly filled', () => {
    // Fill out the form with valid data
    component.contractForm.patchValue({
      contractNumber: 'CNT-001',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      type: 'Insurance',
      status: 'PENDING',
      property: {
        address: '123 Main St',
        area: 1500,
        propertyType: 'RESIDENTIAL',
        value: 250000
      }
    });

    // Now the form should be valid
    expect(component.contractForm.valid).toBeTrue();
  });
});
