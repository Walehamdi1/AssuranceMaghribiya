import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContractComponent } from './contract.component';
import { ContractService } from '../../services/contract.service';

describe('ContractComponent', () => {
  let component: ContractComponent;
  let fixture: ComponentFixture<ContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [ ContractService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractComponent);
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
    component.contractForm.patchValue({
      contractNumber: 'CN-001',
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

    expect(component.contractForm.valid).toBeTrue();
  });
});
