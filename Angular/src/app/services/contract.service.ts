import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';


export interface Contract {
  id?: number;
  contractNumber: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  property: {
    address: string;
    area: number;
    propertyType: string;
    value: number;
  };
  signatureVerificationStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private baseUrl = 'http://localhost:8069/api/contracts';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.baseUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAllContractsByUser(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`http://localhost:8069/api/contracts/user`);
  }

  createContract( contract: Contract): Observable<Contract> {
    const payload = {
      ...contract,
      property: contract.property || { address: '', area: 0, propertyType: '', value: 0 } // Ensures property is defined
    };

    return this.http.post<Contract>(
      this.baseUrl,
      payload,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateContract(contractId: number, contract: Contract): Observable<Contract> {
    if (!contractId) return throwError(() => new Error('Invalid contract ID'));

    const payload = {
      ...contract,
      property: contract.property || { address: '', area: 0, propertyType: '', value: 0 }
    };

    return this.http.put<Contract>(
      `${this.baseUrl}/${contractId}`,
      payload,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteContract(contractId: number): Observable<void> {
    if (!contractId) return throwError(() => new Error('Invalid contract ID'));

    return this.http.delete<void>(
      `${this.baseUrl}/${contractId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Error details:', error);

    let errorMessage = 'Server error. Please try again later.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else if (!error.status) {
      errorMessage = 'Network error - check your connection.';
    } else if (error.status === 404) {
      errorMessage = 'Requested resource not found.';
    } else {
      errorMessage = `Backend error (code ${error.status}): ${error.message || 'Unknown error'}`;
    }

    return throwError(() => new Error(errorMessage));
  }


  
  signeContract(contractId: number, signatureFile: File): Observable<Contract> {
  const formData = new FormData();
  formData.append('signature', signatureFile);
  return this.http.put<Contract>(`${this.baseUrl}/${contractId}/signer`, formData);
}

getContractById(id: number): Observable<Contract> {
  return this.http.get<Contract>(`${this.baseUrl}/${id}`);
}

getContractsByUserId(userId: number): Observable<Contract[]> {
  return this.http.get<Contract[]>(`${this.baseUrl}/user/${userId}`, { headers: this.getHeaders() })
    .pipe(catchError(this.handleError));
}

verifySignature(contractId: number, status: string): Observable<Contract> {
  const params = new HttpParams().set('status', status);
  
  return this.http.put<Contract>(
    `${this.baseUrl}/${contractId}/verify-signature`,
    null,
    { params, headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}




}
