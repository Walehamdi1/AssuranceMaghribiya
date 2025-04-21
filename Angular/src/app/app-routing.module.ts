import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ===== Front Components =====
import { HomeComponent } from './front/home/home.component';
import { SignInComponent } from './front/sign-in/sign-in.component';
import { SignUpComponent } from './front/sign-up/sign-up.component';
import { ProfiluserComponent } from './profiluser/profiluser.component';

// Contracts
import { ContractComponent } from './front/contract/contract.component';
import { CreateContractComponent } from './front/contract/create-contract/create-contract.component';
import { ClientContractsComponent } from './front/contract/client-contracts/client-contracts.component';
import { ContractCrudComponent } from './admin/contract-crud/contract-crud.component';
import { ListContractComponent } from './admin/contract-crud/list-contract/list-contract.component';
import { ContractUpdateComponent } from './admin/contract-crud/update-contract/update-contract.component';

// Sinisters
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { HistorComponent } from './front/Sinister/histor/histor.component';
import { SinisterComponent } from './front/Sinister/sinister.component';
import { SinisterDetailsComponent } from './front/Sinister/sinister-details/sinister-details.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { SinistercalComponent } from './admin/sinister-ad/sinistercal/sinistercal.component';
import { SinisterchartComponent } from './admin/sinister-ad/sinisterchart/sinisterchart.component';
import { ArchivedComponent } from './admin/sinister-ad/archived/archived.component';
import { FileViewerComponent } from './admin/sinister-ad/file-viewer/file-viewer.component';

// Appointments
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { CalendarComponent } from './components/calendar/calendar.component';

// Claims
import { ClaimsListComponent } from './components/claims-list/claims-list.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';
import { SatisfactionSurveyComponent } from './satisfaction-survey/satisfaction-survey.component';

// Devis
import { DevisBackOfficeComponent } from './admin/DevisBackoffice/devis-back-office/devis-back-office.component';
import { DevisComponent } from './front/Devis/devis/devis.component';
import { CreateDevisHabitationComponent } from './front/Devis/create-devis-habitation/create-devis-habitation/create-devis-habitation.component';
import { DevisListComponent } from './front/Devis/devis-list/devis-list.component';
import { DevisTypeComponent } from './front/Devis/devistypePage/devis-type/devis-type.component';

// Payments
import { PaymentComponent } from './front/payment/payment/payment.component';

// Dashboard
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ConsultationsListComponent } from './admin/consultations-list/consultations-list.component';
import { ExpertListComponent } from './components/expert-list/expert-list.component';
import { ExpertConsultationsComponent } from './expert-consultations/expert-consultations.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { AssignExpertComponent } from './assign-expert/assign-expert.component';
import { ConsultationCreateComponent } from './components/consultation-create/consultation-create.component';
import { ConsultingListComponent } from './components/consulting-list/consulting-list.component';
import { ExpertProfileComponent } from './components/expert-profile/expert-profile.component';
import { RoleGuardService } from './services/roleguard.service';

const routes: Routes = [
  // Default & wildcard
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Authentication
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },

  { path: 'consultations', component: ConsultationsListComponent },
  { path: 'consultation-create', component: ConsultationCreateComponent },
  { path: 'consulting-list', component: ConsultingListComponent },
  { path: 'expert-profile', component: ExpertProfileComponent },

  // Home
  { path: 'home', component: HomeComponent, children: [
    { path: 'new-claim', component: ClaimFormComponent },
    { path: 'consultation-create', component: ConsultationCreateComponent },
    { path: 'consulting-list', component: ConsultingListComponent },
    { path: 'mes-consultations', component: ExpertConsultationsComponent },
  ] },

  // Profile
  { path: 'profiluser', component: ProfiluserComponent },

  // Contracts - Front
  { path: 'contract', component: ContractComponent },
  { path: 'contract/create', component: CreateContractComponent },
  { path: 'contract/client-contracts', component: ClientContractsComponent },

  // Sinisters - Front
  { path: 'create', component: CreateSinComponent },
  { path: 'track', component: HistorComponent },
  { path: 'sinister', component: SinisterComponent },
  { path: 'sinisterdetails/:id', component: SinisterDetailsComponent },

  // Appointments
  { path: 'appointment/add', component: AppointmentFormComponent },
  { path: 'appointment-detail', component: AppointmentDetailComponent },
  { path: 'calendar', component: CalendarComponent },

  // Claims
  { path: 'user-claims', component: ClaimsListComponent },
  { path: 'claim/add', component: ClaimFormComponent },

  // Satisfaction
  { path: 'satisfaction-survey/:claimId/:userId', component: SatisfactionSurveyComponent },

  // Devis - Front
  { path: 'devis', component: DevisComponent },
  { path: 'create-devis-habitation', component: CreateDevisHabitationComponent },
  { path: 'devisList', component: DevisListComponent },
  { path: 'devisType', component: DevisTypeComponent },

  // Payment
  { path: 'pay', component: PaymentComponent },
  //consultation
  { path: 'mes-consultations', component: ExpertConsultationsComponent },

  
  { path: 'client/:id', component: ClientDetailsComponent }, 
  { path: 'experts/:consultationId', component: ExpertListComponent },
  { path: 'assign-expert/:id', component: AssignExpertComponent },
  { path: 'consultation/:consultationId/expert', component: ExpertListComponent },
  { path: 'consultation/:id', component: ConsultationCreateComponent },

  // Admin routes
  { path: 'admin', component: DashboardComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'ROLE_ADMIN' } ,children: [
    // Sinisters
    { path: 'sinister', component: SinisterADComponent },
    { path: 'sinister/create', component: SinistercreateComponent },
    { path: 'sinister/update/:id', component: SinisterupdateComponent },
    { path: 'sinister/display/:id', component: SinisterdisplayComponent },
    { path: 'sinister/calendar', component: SinistercalComponent },
    { path: 'sinister/chart', component: SinisterchartComponent },
    { path: 'sinister/archived', component: ArchivedComponent },

    // Appointments
    { path: 'appointments', component: AppointmentListComponent },
    { path: 'appointment/edit/:id', component: AppointmentFormComponent },

    // Claims
    { path: 'claims', component: ClaimsListComponent },
    { path: 'claim/add', component: ClaimFormComponent },
    { path: 'claim/edit/:id', component: ClaimFormComponent },

    // Contracts - Admin
    { path: 'contract-crud/list', component: ListContractComponent },
    { path: 'contract-crud/Update/:id', component: ContractUpdateComponent },
    { path: 'contract-crud/create', component: CreateContractComponent },
    { path: 'contract-crud', component: ContractCrudComponent },

    // Devis - Admin
    { path: 'devis', component: DevisBackOfficeComponent },

    // Files
    { path: 'view-file', component: FileViewerComponent },
    //
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
    { path: 'consultations', component: ConsultationsListComponent },
    { path: 'assignexpert/:consultationId',component: ExpertListComponent},
  ]
},
{ path: '**', redirectTo: '/home' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
