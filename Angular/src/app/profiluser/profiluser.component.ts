import { Component, OnInit } from '@angular/core';
import { ClaimsService } from 'src/app/services/claims.service';
import { Claim } from 'src/app/models/claim.model';


@Component({
  selector: 'app-profiluser',
  templateUrl: './profiluser.component.html',

})
export class ProfiluserComponent implements OnInit {
  claims: Claim[] = [];

  constructor(private claimsService: ClaimsService) { }

  ngOnInit(): void {
    this.loadClaims();
  }

  // Charger les réclamations depuis le service
  loadClaims(): void {
    this.claimsService.getClaims().subscribe(
      data => this.claims = data,
      error => console.error('Erreur lors du chargement des réclamations', error)
    );
  }
}
