import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService, Contract } from 'src/app/services/contract.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;
import * as Papa from 'papaparse';


@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss']
})
export class CreateContractComponent implements OnInit {
  contractForm!: FormGroup;
  message: string = '';
  isLoading: boolean = false;
  verificationMessage: string = '';
  // For two-step process:
  createdContract?: Contract;
  signatureFile?: File;
  showExtraFields: boolean = false;


  constructor(private fb: FormBuilder, private contractService: ContractService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // Set default values: contract number begins with "CNT-" and status is "PENDING"
    this.contractForm = this.fb.group({
      contractNumber: ['CNT-', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      type: ['', Validators.required],
      status: ['PENDING', Validators.required],
      property: this.fb.group({
        address: ['', Validators.required],
        area: [null, [Validators.required, Validators.min(1)]],
        propertyType: ['', Validators.required],
        value: [null, [Validators.required, Validators.min(0)]]
      })
    });
  }

  onSubmit(): void {
    if (this.contractForm.invalid) {
      this.message = 'Please correct the form errors.';
      this.contractForm.markAllAsTouched();
      return;
    }
  
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      this.message = 'User not authenticated.';
      return;
    }
  
    const currentUser = JSON.parse(storedUser);
    const userId = currentUser.id;
  
    const formValue = this.contractForm.value;
  
    if (!formValue.contractNumber.startsWith('CNT-')) {
      formValue.contractNumber = 'CNT-' + formValue.contractNumber;
    }
  
    formValue.status = 'PENDING';
  
    const contractData: Contract = {
      ...formValue,
      property: { ...formValue.property },
      userId: userId // ✅ Add userId to the request
    };
  
    this.isLoading = true;
    this.contractService.createContract(contractData).subscribe({
      next: (created) => {
        this.message = 'Contract created successfully! You can now sign the contract below if desired.';
        this.createdContract = created;
        this.showExtraFields = true;
      },
      error: (err) => {
        this.handleError(err, 'creating contract');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  

  // Method to handle file input change event
  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csvData = reader.result as string;
        Papa.parse(csvData, {
          header: true, // Assumes the CSV file contains header row
          skipEmptyLines: true,
          complete: (result) => {
            this.populateForm(result.data);
          },
          error: (error:any) => {
            console.error('Error parsing CSV:', error);
            this.message = 'Error parsing CSV file.';
          }
        });
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        this.message = 'Error reading CSV file.';
      };
    }
  }
  // Map CSV data to form fields
  populateForm(data: any[]): void {
  if (data && data.length > 0) {
    // Assume CSV has columns: contractNumber, startDate, endDate, type, status,
    // propertyAddress, propertyArea, propertyType, propertyValue
    const row = data[0]; // For a step-by-step process, you might loop through multiple rows

    this.contractForm.patchValue({
      contractNumber: row.contractNumber,
      startDate: row.startDate,
      endDate: row.endDate,
      type: row.type,
      status: row.status,
      property: {
        address: row.propertyAddress,
        area: row.propertyArea,
        propertyType: row.propertyType,
        value: row.propertyValue
      }
    });

    this.message = 'CSV data loaded into the form successfully.';
  } else {
    this.message = 'CSV file is empty or invalid.';
  }
}

onSignatureFileChange(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    this.signatureFile = event.target.files[0];
  }
}

signContract(): void {
  if (!this.createdContract || !this.signatureFile) {
    this.message = 'Please select a signature file.';
    return;
  }
  this.isLoading = true;
  this.contractService.signeContract(this.createdContract.id!, this.signatureFile).subscribe({
    next: (signedContract) => {
      this.createdContract = signedContract;
      // Check the signatureVerificationStatus
      if (signedContract.signatureVerificationStatus?.toUpperCase() === 'PENDING') {
        this.message = 'Signature submitted. Your signature is pending admin approval.';
      } else if (signedContract.signatureVerificationStatus?.toUpperCase() === 'VERIFIED') {
        this.message = 'Signature Verified!';
      } else if (signedContract.signatureVerificationStatus?.toUpperCase() === 'INVALID') {
        this.message = 'Signature Invalid. Please try again.';
      }
    },
    error: (err) => {
      this.handleError(err, 'signing contract');
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}



  
  isFieldInvalid(field: string): boolean {
    const control = this.contractForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
  
  resetForm(): void {
    this.contractForm.reset();
    this.contractForm.patchValue({ contractNumber: 'CNT-', status: 'PENDING' });
  }

  private handleError(err: any, context: string): void {
    console.error(`Error ${context}:`, err);
    this.message = `Error ${context}. Please try again.`;
  }
}
