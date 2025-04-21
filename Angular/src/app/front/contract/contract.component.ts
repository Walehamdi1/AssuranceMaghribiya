import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService, Contract } from '../../services/contract.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  contractForm!: FormGroup;
  contracts: Contract[] = [];
  filteredContracts: Contract[] = [];
  message: string = '';
  selectedContract?: Contract;
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private contractService: ContractService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadContracts();
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

  loadContracts(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      this.message = 'User not authenticated.';
      return;
    }

    const currentUser = JSON.parse(storedUser);
    const userId = currentUser.id;

    this.isLoading = true;
    this.contractService.getAllContractsByUser().subscribe({
      next: (data) => {
        this.contracts = data;
        this.filteredContracts = data;
        this.message = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'loading contracts');
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredContracts = this.contracts;
    } else {
      const lowerSearch = this.searchTerm.toLowerCase();
      this.filteredContracts = this.contracts.filter(contract =>
        contract.contractNumber.toLowerCase().includes(lowerSearch)
      );
    }
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

    const contractData: Contract = {
      ...this.contractForm.value,
      property: { ...this.contractForm.value.property },
      userId: userId
    };

    this.isLoading = true;

    const operation = this.selectedContract
      ? this.contractService.updateContract(this.selectedContract.id!, contractData)
      : this.contractService.createContract(contractData);

    operation.subscribe({
      next: () => {
        this.message = `Contract ${this.selectedContract ? 'updated' : 'created'} successfully!`;
        this.loadContracts();
        this.resetForm();
      },
      error: (err) => {
        this.handleError(err, this.selectedContract ? 'updating contract' : 'creating contract');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onEdit(contract: Contract): void {
    this.selectedContract = contract;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.contractForm.patchValue({
      ...contract,
      startDate: this.formatDateForInput(contract.startDate),
      endDate: this.formatDateForInput(contract.endDate),
      property: contract.property || { address: '', area: 0, propertyType: '', value: 0 }
    });
  }

  onDelete(contract: Contract): void {
    if (!confirm('Delete this contract permanently?')) return;
    this.isLoading = true;
    this.contractService.deleteContract(contract.id!).subscribe({
      next: () => {
        this.message = 'Contract deleted successfully!';
        this.loadContracts();
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'deleting contract');
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.selectedContract = undefined;
    this.resetForm();
    this.message = '';
  }

  resetForm(): void {
    this.contractForm.reset();
    this.selectedContract = undefined;
    Object.keys(this.contractForm.controls).forEach(key => {
      this.contractForm.get(key)?.setErrors(null);
    });
  }

  private handleError(err: any, context: string): void {
    console.error(`Error ${context}:`, err);
    this.message = `Error ${context}. Please try again.`;
  }

  private formatDateForInput(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contractForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  downloadPDF(contract: Contract): void {
    const docDefinition: any = {
      content: [
        { text: 'Contract Details', style: 'header' },
        {
          columns: [
            { width: '50%', text: `Contract Number: ${contract.contractNumber}` },
            { width: '50%', text: `Status: ${contract.status}`, alignment: 'right' }
          ],
          margin: [0, 10, 0, 10]
        },
        { text: 'Dates', style: 'subheader' },
        {
          columns: [
            { width: '50%', text: `Start Date: ${contract.startDate}` },
            { width: '50%', text: `End Date: ${contract.endDate}`, alignment: 'right' }
          ],
          margin: [0, 0, 0, 10]
        },
        { text: 'Property Details', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              [{ text: 'Field', bold: true }, { text: 'Value', bold: true }],
              ['Address', contract.property.address],
              ['Area', contract.property.area.toString()],
              ['Property Type', contract.property.propertyType],
              ['Value', contract.property.value.toString()]
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10]
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      },
      footer: (currentPage: number, pageCount: number) => ({
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      })
    };

    pdfMake.createPdf(docDefinition).download(`Contract_${contract.contractNumber}.pdf`);
  }
}