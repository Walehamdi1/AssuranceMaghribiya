import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService, Contract } from '../../../services/contract.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // for ngClass, etc.
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-contract-update',
  templateUrl: './update-contract.component.html',
  styleUrls: ['./update-contract.component.scss']
})
export class ContractUpdateComponent implements OnInit {
  contractForm!: FormGroup;
  contractId!: number;
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContract();
  }

  private initForm(): void {
    this.contractForm = this.fb.group({
      contractNumber: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      property: this.fb.group({
        address: ['', Validators.required],
        area: [null, [Validators.required, Validators.min(1)]],
        propertyType: ['', Validators.required],
        value: [null, [Validators.required, Validators.min(0)]]
      })
    });
  }

  private loadContract(): void {
    this.isLoading = true;
    this.contractService.getContractById(this.contractId).subscribe({
      next: (contract: Contract) => {
        this.contractForm.patchValue({
          contractNumber: contract.contractNumber,
          startDate: this.formatDateForInput(contract.startDate),
          endDate: this.formatDateForInput(contract.endDate),
          type: contract.type,
          status: contract.status,
          property: {
            address: contract.property.address,
            area: contract.property.area,
            propertyType: contract.property.propertyType,
            value: contract.property.value
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error loading contract';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.contractForm.invalid) {
      this.message = 'Please correct the form errors.';
      this.contractForm.markAllAsTouched();
      return;
    }

    const updatedContract: Contract = this.contractForm.value;
    this.isLoading = true;
    this.contractService.updateContract(this.contractId, updatedContract).subscribe({
      next: () => {
        this.message = 'Contract updated successfully!';
        this.router.navigate(['/admin/contract-crud/list']);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating contract';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin', 'contract-crud', 'list',]);
  }

  private formatDateForInput(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contractForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
