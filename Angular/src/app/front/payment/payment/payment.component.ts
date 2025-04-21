import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StripeCardElementOptions, StripeElementsOptions, StripeCardElement, Stripe } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent, StripeElementsService } from 'ngx-stripe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements AfterViewInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  paymentForm: FormGroup;
  elementsOptions: StripeElementsOptions = { locale: 'fr' };
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': { color: '#aab7c4' }
      }
    }
  };
  cardElement!: StripeCardElement;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private http: HttpClient
  ) {
    this.paymentForm = this.fb.group({
      name: [''],
      amount: [''] // Champ pour le montant
    });
  }

  ngAfterViewInit() {
    this.cardElement = this.card.element;
  }

  pay(): void {
    if (!this.cardElement) {
      console.error('L\'élément de carte Stripe n\'est pas initialisé.');
      return;
    }

    const amount = this.paymentForm.value.amount;
    if (!amount || amount <= 0) {
      console.error('Montant invalide.');
      return;
    }

    // Étape 1 : Demander un clientSecret au backend
    this.http.post<{ clientSecret: string }>('http://localhost:8069/api/payments/create-payment-intent', { amount })
      .subscribe(response => {
        const clientSecret = response.clientSecret;

        // Étape 2 : Confirmer le paiement avec Stripe
        this.stripeService.elements()
          .subscribe(elements => {
            this.stripeService.confirmCardPayment(clientSecret, {
              payment_method: {
                card: this.cardElement,
                billing_details: { name: this.paymentForm.value.name }
              }
            }).subscribe(result => {
              if (result.paymentIntent?.status === 'succeeded') {
                alert('Paiement réussi ! 🎉');
              } else {
                console.error('Erreur de paiement:', result.error?.message);
              }
            });
          });
      }, error => {
        console.error('Erreur lors de la création du paiement:', error);
      });
  }
}
