import { Component, OnInit } from '@angular/core';
import { ContractService, Contract } from 'src/app/services/contract.service';

@Component({
  selector: 'app-client-contracts',
  templateUrl: './client-contracts.component.html',
  styleUrls: ['./client-contracts.component.scss']
})
export class ClientContractsComponent implements OnInit {
  contracts: Contract[] = [];
  isLoading: boolean = false;
  message: string = '';
  searchTerm: string = '';
  
  // When a contract is selected, its details will be shown
  selectedContract: Contract | null = null;

  // For demo purposes, we'll use a static user id (e.g., 1)
  userId: number = 1;

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.isLoading = true;
    // Fetch contracts for a static user id (in a real app, get from auth)
    this.contractService.getContractsByUserId(this.userId).subscribe({
      next: (data) => {
        this.contracts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading contracts:', err);
        this.message = 'Error loading your contracts.';
        this.isLoading = false;
      }
    });
  }

  // Called when a user clicks on a contract row
  onSelect(contract: Contract): void {
    this.selectedContract = contract;
  }

  // Go back to the list view
  backToList(): void {
    this.selectedContract = null;
    this.message = '';
  }

  // Optional search filter for contracts by contract number
  onSearchChange(): void {
    if (!this.searchTerm) {
      // If search term is empty, reload all contracts
      this.loadContracts();
    } else {
      const lowerSearch = this.searchTerm.toLowerCase();
      // Filter the existing contracts (you might want to adjust this to use a separate filtered list)
      this.contracts = this.contracts.filter(contract =>
        contract.contractNumber.toLowerCase().includes(lowerSearch)
      );
    }
  }
}
