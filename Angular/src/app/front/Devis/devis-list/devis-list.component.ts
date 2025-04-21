import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PaiementDialogComponent } from '../paiement-dialog/paiement-dialog.component';
import { PaiementService } from 'src/app/services/paiement.service';
import { DevisService } from 'src/app/services/devis.service';
import { ModifierDevisComponent } from '../modifier-devis/modifier-devis.component';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { Devis } from 'src/app/models/Devis.model';


@Component({
  selector: 'app-devis-list',
  templateUrl: './devis-list.component.html',
  styleUrls: ['./devis-list.component.css'] 
})
export class DevisListComponent implements OnInit,AfterViewInit{

  devisList: Devis[] = [];
  searchText: string = '';
  page: number = 1;


  signature: string = '';
  @ViewChild('signaturePad') signaturePad!: SignaturePadComponent;

  signaturePadOptions = {

    canvasWidth: 192,
    canvasHeight: 96
  };
  ngAfterViewInit(): void {
    this.signaturePad.clear(); // Initialiser le pad de signature
  }

  constructor(private devisService: DevisService,
    public dialog: MatDialog,
    private paiementService : PaiementService
  ) {}

  ngOnInit(): void {
    this.getDevisList();
  }
  drawStart(event: MouseEvent | Touch): void {
    console.log('Début du dessin', event);
  }

  drawComplete(event: MouseEvent | Touch): void {
    console.log('Fin du dessin', event);
  }

  clearSignature(): void {
    this.signaturePad.clear();
    setTimeout(() => {

      
      this.signaturePad.set('minWidth', 1);
      this.signaturePad.set('min', 1);
    
      this.signaturePad.set('canvasHeight', 96);
    }, 0);
    
    
  }

  saveSignature(devisId: number): void {
    if (this.signaturePad.isEmpty()) {
      alert("Veuillez signer avant d'enregistrer.");
      return;
    }
  
    const signatureBase64 = this.signaturePad.toDataURL("image/png");
  
    this.devisService.signerDevisBase64(devisId, signatureBase64).subscribe(
      (res) => {
        console.log("Signature enregistrée !");
        this.getDevisList();
      },
      (err) => {
        console.error("Erreur d'enregistrement de la signature", err);
        alert("Erreur lors de la signature du devis.");
      }
    );
  }
  

  getDevisList(): void {
    this.devisService.getDevisByUser().subscribe(
      (data) => {
        this.devisList = data;
    
      },
      (error) => {
        console.error("Erreur lors de la récupération des devis :", error);
      }
    );
  }

  editDevis(devis: Devis): void {
    console.log("Modification du devis :", devis);
  }

  deleteDevis(id: any): void {
  
      this.devisService.deleteDevis(id).subscribe(() => {
        this.devisList = this.devisList.filter(devis => devis.id !== id);
      });
    
  }

  openModifierDialog(devis: any) {
    const dialogRef = this.dialog.open(ModifierDevisComponent, {
      width: '500px',
      data: devis 
    });

    dialogRef.afterClosed().subscribe(updatedDevis => {
      if (updatedDevis) {
        // Find and update the devis in the list
        const index = this.devisList.findIndex(d => d.nomClient === devis.nomClient);
        if (index !== -1) {
          this.devisList[index] = updatedDevis;
        }
      }
    });
  }

  openPaiementDialog(devis: Devis) {
    if (!devis.id) {
      console.error("L'ID du devis est indéfini !");
      return;
    }
  
    this.devisService.getDevisById(devis.id).subscribe(devisComplet => {
      console.log("Ouverture du popup de paiement pour le devis ID:", devis.id);
      this.paiementService.getPaiementsByDevis(devisComplet.id).subscribe(paiements => {
        const dialogRef = this.dialog.open(PaiementDialogComponent, {
          data: { devis: devisComplet, paiements },
          width: '600px',
          height: 'auto',
          panelClass: 'custom-dialog-container'
        });
  
        dialogRef.afterClosed().subscribe(() => this.getDevisList());
      });
    });
  }

  //verify signature

  verificationResults: { [key: number]: { result: string, dissimilarity: number } } = {};

onCompareSignatureUpload(event: Event, devisId: number): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const uploadedFile = input.files[0];
  const originalSignatureURL = `http://localhost:8069/signatures/signature_${devisId}.png`;

  fetch(originalSignatureURL)
    .then(response => response.blob())
    .then(originalSignatureBlob => {
      const formData = new FormData();
      formData.append('file1', uploadedFile);
      formData.append('file2', originalSignatureBlob, `signature_${devisId}.png`);

      fetch('https://cfbe-34-142-146-166.ngrok-free.app/verify', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          this.verificationResults[devisId] = {
            result: data.result,
            dissimilarity: data.dissimilarity
          };
        })
        .catch(err => {
          console.error("Erreur lors de la comparaison de signature:", err);
          alert("Échec de la vérification de la signature.");
        });
    })
    .catch(err => {
      console.error("Impossible de charger la signature d'origine :", err);
    });
}

  

}
