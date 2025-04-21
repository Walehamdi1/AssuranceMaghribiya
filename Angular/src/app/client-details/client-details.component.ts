
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service'; // Importer le service ClientService
import { Client } from 'src/app/models/client.model'; 

@Component({
  selector: 'app-client-details',
  standalone: true, 
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
  imports: [CommonModule]
})
@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
  
})
export class ClientDetailsComponent implements OnInit {

  client: Client | null = null; // Déclarez une propriété pour stocker les données du client

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClientDetails(1); // Charger les détails du client (exemple avec l'ID 1)
  }

  loadClientDetails(clientId: number): void {
    this.clientService.getClientById(clientId).subscribe(
      (data: Client) => {
        this.client = data; // Mettez à jour la variable 'client' avec les données récupérées
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du client', error);
      }
    );
  }
}
