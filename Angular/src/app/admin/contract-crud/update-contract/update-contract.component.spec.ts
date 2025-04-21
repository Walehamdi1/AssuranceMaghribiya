import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContractUpdateComponent } from './update-contract.component';
import { ContractService, Contract } from '../../../services/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ContractUpdateComponent', () => {
  let component: ContractUpdateComponent;
  let fixture: ComponentFixture<ContractUpdateComponent>;
  let contractService: jasmine.SpyObj<ContractService>;
  let router: Router;

  // Create a mock contract with dates as strings
  const contractMock: Contract = {
    id: 1,
    contractNumber: 'CNT-001',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    type: 'Auto Insurance',
    status: 'PENDING',
    property: {
      address: '123 Main St',
      area: 1000,
      propertyType: 'RESIDENTIAL',
      value: 250000
    }
  };

  beforeEach(async () => {
    const contractServiceSpy = jasmine.createSpyObj('ContractService', ['getContractById', 'updateContract']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ ContractUpdateComponent ],
      providers: [
        { provide: ContractService, useValue: contractServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } } // simulate route parameter "id" as '1'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContractUpdateComponent);
    component = fixture.componentInstance;
    contractService = TestBed.inject(ContractService) as jasmine.SpyObj<ContractService>;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load contract on init', () => {
    contractService.getContractById.and.returnValue(of(contractMock));
    fixture.detectChanges(); // calls ngOnInit()

    // Verify the form is patched with the contract data
    expect(component.contractForm).toBeDefined();
    expect(component.contractForm.get('contractNumber')?.value).toEqual(contractMock.contractNumber);
  });

  it('should update contract on submit', () => {
    // Set up the form with valid data
    component.contractForm.patchValue({
      contractNumber: contractMock.contractNumber,
      startDate: contractMock.startDate,
      endDate: contractMock.endDate,
      type: contractMock.type,
      status: contractMock.status,
      property: {
        address: contractMock.property.address,
        area: contractMock.property.area,
        propertyType: contractMock.property.propertyType,
        value: contractMock.property.value
      }
    });
    
    // Return the mock contract from updateContract
    contractService.updateContract.and.returnValue(of(contractMock));
    spyOn(router, 'navigate');

    component.onSubmit();

    expect(contractService.updateContract).toHaveBeenCalledWith(1, component.contractForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['/contracts']);
  });

  it('should handle error when loading contract', () => {
    contractService.getContractById.and.returnValue(throwError(() => new Error('Error loading contract')));
    fixture.detectChanges();
    expect(component.message).toEqual('Error loading contract');
  });
});
