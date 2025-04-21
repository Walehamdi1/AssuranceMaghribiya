import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';

// Composants
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { HistorComponent } from './front/Sinister/histor/histor.component';

import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';

import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { UserService } from './services/UserService'; // Importation de UserService
import { ClaimsListComponent } from './components/claims-list/claims-list.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';


import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { SinisterComponent } from './front/Sinister/sinister.component';
import { SinistercalComponent } from './admin/sinister-ad/sinistercal/sinistercal.component';
import { SinisterchartComponent } from './admin/sinister-ad/sinisterchart/sinisterchart.component';
import { FileViewerComponent } from './admin/sinister-ad/file-viewer/file-viewer.component';
import { SignUpComponent } from './front/sign-up/sign-up.component';
import { SignInComponent } from './front/sign-in/sign-in.component';
import { ArchivedComponent } from './admin/sinister-ad/archived/archived.component';
import { SinisterDetailsComponent } from './front/Sinister/sinister-details/sinister-details.component';


// Modules Angular & Angular Material
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';


import { ProfiluserComponent } from './profiluser/profiluser.component'; // Pour utiliser RouterLink
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { SatisfactionSurveyComponent } from './satisfaction-survey/satisfaction-survey.component';


import { ContractCrudComponent } from './admin/contract-crud/contract-crud.component';
import { ContractComponent } from './front/contract/contract.component';
import { CreateContractComponent } from './front/contract/create-contract/create-contract.component';
import { ListContractComponent } from './admin/contract-crud/list-contract/list-contract.component';
import { ContractUpdateComponent } from './admin/contract-crud/update-contract/update-contract.component';
import * as Papa from 'papaparse';
import { ClientContractsComponent } from './front/contract/client-contracts/client-contracts.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { provideOAuthClient, OAuthService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxStripeModule } from 'ngx-stripe';
import { DevisBackOfficeComponent } from './admin/DevisBackoffice/devis-back-office/devis-back-office.component';
import { DevisComponent } from './front/Devis/devis/devis.component';
import { DevisListComponent } from './front/Devis/devis-list/devis-list.component';
import { CreateDevisHabitationComponent } from './front/Devis/create-devis-habitation/create-devis-habitation/create-devis-habitation.component';
import { DevisTypeComponent } from './front/Devis/devistypePage/devis-type/devis-type.component';
import { PaiementDialogComponent } from './front/Devis/paiement-dialog/paiement-dialog.component';
import { AdvancedSearchPipe } from './services/search.pipe';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ModifierDevisComponent } from './front/Devis/modifier-devis/modifier-devis.component';
import { PaymentComponent } from './front/payment/payment/payment.component';



import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    HomeComponent,
    HistorComponent,
    CreateSinComponent,
    SinisterADComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    ClaimsListComponent,
    ClaimFormComponent,
    ProfiluserComponent,
    CalendarComponent,
    AppointmentDetailComponent,
    SatisfactionSurveyComponent,

    SinistercreateComponent,
    SinisterupdateComponent,
    SinisterdisplayComponent,

    ContractCrudComponent,
    ContractComponent,
    CreateContractComponent,
    ListContractComponent,
    ContractUpdateComponent,
    ClientContractsComponent,

    SinisterComponent,
    SinistercalComponent,
    SinisterchartComponent,
    FileViewerComponent,
    SignUpComponent,
    SignInComponent,
    ArchivedComponent,
    SinisterDetailsComponent,
    DevisBackOfficeComponent,
    DevisComponent,
    DevisListComponent,
    CreateDevisHabitationComponent,
    DevisTypeComponent,
    PaiementDialogComponent,
    AdvancedSearchPipe,
    ModifierDevisComponent,
    PaymentComponent
    


  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FullCalendarModule,
    RouterModule ,// Ajout du RouterModule pour RouterLink
    MatSnackBarModule, // Ajout du RouterModule pour RouterLink
    MatPaginatorModule,
    AngularSignaturePadModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    NgxPaginationModule,
    NgxStripeModule.forRoot('pk_test_51Qz0h5Q0ic8mbnmqhHpXMcHLA8ExJypPCIdLQvVleZNs5EuZRYRjcDZQF3f7LwPSAGO0byAWLZWnqzkmZSXCQ5Cm00NrTcLoYb') // Remplace par ta clé publique Stripe
  ],
  providers: [
    UserService,
    provideOAuthClient(),
    provideHttpClient(),
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          // OAuth initialization logic here if needed
        };
      },
      multi: true,
      deps: [OAuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
