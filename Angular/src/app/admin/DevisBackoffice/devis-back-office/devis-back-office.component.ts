import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModifierDevisComponent } from 'src/app/front/Devis/modifier-devis/modifier-devis.component';
import { Devis } from 'src/app/models/Devis.model';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-devis-back-office',
  templateUrl: './devis-back-office.component.html',
  styleUrls: ['./devis-back-office.component.css']
})
export class DevisBackOfficeComponent {
  countPending = 0;
  countAccepted = 0;
  countRejected = 0;
  devisList: Devis[] = [];
  searchText = '';
  page = 1;

  confirmDeleteId: number | null = null;

  constructor(
    private devisService: DevisService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getDevisList();
  }

  getDevisList(): void {
    this.devisService.getAllDevis().subscribe(
      (data) => {
        this.devisList = data;
        this.updateStatistics();
      },
      (error) => {
        console.error("Erreur lors de la récupération des devis :", error);
      }
    );
  }

  updateStatistics(): void {
    this.countPending = this.devisList.filter(d => d.statut === 'EN_ATTENTE').length;
    this.countAccepted = this.devisList.filter(d => d.statut === 'ACCEPTÉ').length;
    this.countRejected = this.devisList.filter(d => d.statut === 'REJETÉ').length;
  }

  confirmDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  deleteConfirmed(id: number): void {
    this.devisService.deleteDevis(id).subscribe(() => {
      this.devisList = this.devisList.filter(d => d.id !== id);
      this.updateStatistics();
      this.snackBar.open('Devis supprimé avec succès.', 'Fermer', { duration: 3000 });
      this.confirmDeleteId = null;
    });
  }

  toggleDevisStatus(devis: Devis): void {
    if (!devis.signature) {
      this.snackBar.open("Vous devez signer le devis avant de changer son statut.", "Fermer", {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return;
    }

    devis.statut = devis.statut === 'ACCEPTÉ' ? 'REJETÉ' : 'ACCEPTÉ';

    this.devisService.updateDevis(devis.id, devis).subscribe(
      () => {
        this.updateStatistics();
        this.snackBar.open(`Statut changé à ${devis.statut}.`, 'Fermer', { duration: 3000 });
      },
      (error) => {
        console.error("Erreur lors de la mise à jour du statut :", error);
      }
    );
  }
}

