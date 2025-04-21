import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Devis } from 'src/app/models/Devis.model';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-modifier-devis',
  templateUrl: './modifier-devis.component.html',
  styleUrls: ['./modifier-devis.component.css']
})
export class ModifierDevisComponent {

  devis: Devis;

  constructor(
    private dialogRef: MatDialogRef<ModifierDevisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Devis,
    private devisService: DevisService,
    private snackBar: MatSnackBar,
  ) {
    this.devis = { ...data };
  }

  ngOnInit(): void {}

  onSave(): void {
    this.devisService.updateDevis(this.devis.id!, this.devis).subscribe(
      (response) => {
        this.snackBar.open('Mise à jour réussie 🎉', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(this.devis);
      },
      (error) => {
        this.snackBar.open('Échec de la mise à jour ❌', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        console.error('Error updating devis:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
