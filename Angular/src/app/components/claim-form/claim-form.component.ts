import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsService } from '../../services/claims.service';
import { Claim } from '../../models/claim.model';
import { User } from '../../models/user.model';
import { SatisfactionSurveyService } from '../../services/satisfaction-survey.service'; 

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  claim: Claim = { 
    reclamationType: 'SERVICE', 
    reclamationDate: '', 
    description: '', 
    status: 'ENREGISTREE',
    userId: 5
  };
  today: string = '';
  userPhoneNumber: string = '+21693323188'; 
  predefinedDescriptions: string[] = []; // Variable pour stocker les descriptions
  estimatedTime: number = 0;

  constructor(
    private claimsService: ClaimsService,
    private route: ActivatedRoute,
    private satisfactionSurveyService: SatisfactionSurveyService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
  
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      this.claim.userId = currentUser.id;
    }
  
    this.loadPredefinedDescriptions(this.claim.reclamationType);
  
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.claimsService.getClaimById(+id).subscribe(
        (data: Claim) => {
          this.claim = data;
          this.loadPredefinedDescriptions(this.claim.reclamationType);
        },
        (error: any) => {
          console.error('Erreur lors du chargement de la réclamation', error);
        }
      );
    }
  }
  

  // Méthode pour charger les descriptions prédéfinies en fonction du type
  loadPredefinedDescriptions(type: string): void {
    this.claimsService.getPredefinedDescriptions(type).subscribe(
      (descriptions: string[]) => {
        this.predefinedDescriptions = descriptions;
        if (this.predefinedDescriptions.length > 0) {
          this.claim.description = this.predefinedDescriptions[0]; // Choisir la première suggestion comme description par défaut
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des descriptions prédéfinies', error);
      }
    );
  }
  onDescriptionChange(): void {
    if (this.claim.description.trim().length > 0) {
      this.claimsService.getEstimatedProcessingTime(this.claim.description).subscribe({
        next: (time: number) => this.estimatedTime = time,
        error: (err) => console.error('Erreur d’analyse de description', err)
      });
    } else {
      this.estimatedTime = 0;
    }
  }
  

  // Méthode pour créer une réclamation
  createClaim(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      this.claim.user = new User(currentUser.id);
      this.claim.userId = currentUser.id;
    }
  
    this.claim.status = 'ENREGISTREE';
  
    this.claimsService.createClaim(this.claim, this.userPhoneNumber).subscribe(
      (createdClaim) => {
        if (createdClaim.idClaim !== undefined) {
          this.router.navigate(['/satisfaction-survey', createdClaim.idClaim, this.claim.userId]);
        } else {
          alert('Erreur : L\'ID de la réclamation n\'est pas défini.');
        }
      },
      (error: any) => {
        console.error('Erreur lors de la création de la réclamation', error);
        alert('Une erreur est survenue lors de la création de la réclamation.');
      }
    );
  }
  

  // Méthode pour changer le type de réclamation et charger les nouvelles descriptions
  onReclamationTypeChange(): void {
    this.loadPredefinedDescriptions(this.claim.reclamationType);
  }
}
