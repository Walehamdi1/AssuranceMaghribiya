import { AfterViewChecked, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaiementService } from 'src/app/services/paiement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StripeService, StripeCardComponent, StripeElementsService } from 'ngx-stripe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paiement-dialog',
  templateUrl: './paiement-dialog.component.html',
  styleUrls: ['./paiement-dialog.component.css']
})
export class PaiementDialogComponent implements AfterViewChecked {

  @ViewChild(StripeCardComponent) card: StripeCardComponent | undefined;
  cardElement: any;
  paymentForm: FormGroup;
  method: string = 'Carte Bancaire';
  paiementUnique: boolean = true;
  nombreEcheances: number = 3;
  devis: any;
  elementsOptions: any = { locale: 'fr' };
  cardOptions: any = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': { color: '#aab7c4' }
      }
    }
  };

  constructor(
    public dialogRef: MatDialogRef<PaiementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paiementService: PaiementService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private http: HttpClient
  ) {
    this.devis = data.devis;
    console.log("Devis reçu dans le popup:", this.devis);

    this.paymentForm = this.fb.group({
      name: [''],
      amount: [this.devis.montantTotal] // Montant total du devis
    });
  }

  ngAfterViewChecked() {
    // Ensure that card component is initialized and ready
    if (this.card && !this.cardElement) {
      // Check if the Stripe Card element is available
      this.cardElement = this.card.element;
      if (this.cardElement) {
        console.log('Card element initialized:', this.cardElement);
      } else {
        console.error('Stripe card element is still not available.');
      }
    }
  }
  pay() {
    if (!this.cardElement) {
      console.error('L\'élément de carte Stripe n\'est pas initialisé.');
      return;
    }
  
    const amount = this.devis.montantTotal;
    if (!amount || amount <= 0) {
      console.error('Montant invalide.');
      return;
    }
  
    // Step 1: Get the clientSecret from the backend
    this.http.post<{ clientSecret: string }>('http://localhost:8069/api/payments/create-payment-intent', { amount })
      .subscribe(response => {
        const clientSecret = response.clientSecret;
        console.log('Client secret:', clientSecret);
  
        // Step 2: Confirm the payment with Stripe
        this.stripeService.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.cardElement,
            billing_details: { name: this.paymentForm.value.name }
          }
        }).subscribe(result => {
          if (result.paymentIntent?.status === 'succeeded') {
            console.log('Paiement Stripe réussi, mise à jour du statut côté serveur...');
  
            // Step 3: Update payment status in the backend
            if (this.paiementUnique) {
              this.paiementService.payerEnUneFois(this.devis.id, this.method).subscribe(
                () => {
                  this.snackBar.open("Paiement effectué avec succès !", "Fermer", {
                    duration: 3000,
                    panelClass: ['snackbar-succes']
                  });
                  this.dialogRef.close(true); // Ferme le popup et rafraîchit la liste des devis
                },
                (error) => console.error('Erreur lors du paiement :', error)
              );
            } else {
              this.paiementService.payerEnPlusieursFois(this.devis.id, this.nombreEcheances, this.method).subscribe(
                () => {
                  alert('Paiement échelonné mis en place avec succès !');
                  this.dialogRef.close(true);
                },
                (error) => console.error('Erreur lors du paiement échelonné :', error)
              );
            }
          } else {
            console.error('Erreur de paiement:', result.error?.message);
            this.snackBar.open('Échec du paiement : ' + result.error?.message, 'Fermer', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        }, error => {
          console.error('Erreur lors de la confirmation du paiement:', error);
          this.snackBar.open('Erreur lors de la confirmation du paiement', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        });
      }, error => {
        console.error('Erreur lors de la création du paiement:', error);
        this.snackBar.open('Erreur lors de la création du paiement', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      });
  }
}  