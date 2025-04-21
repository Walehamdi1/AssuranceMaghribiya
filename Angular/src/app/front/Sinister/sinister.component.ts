import { Component, OnInit } from '@angular/core';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { toDataURL } from 'qrcode';

@Component({
  selector: 'app-sinister',
  templateUrl: './sinister.component.html',
  styleUrls: ['./sinister.component.css']
})
export class SinisterComponent implements OnInit {
  qrCodeImage: string = ''; // To store the generated QR code image

  constructor(private sinistersService: SinistersService) {}

  ngOnInit() {
    this.loadSinistersForUser(1); // Load sinisters for user_id = 1
  }

  // Fetch sinisters for a specific user
  loadSinistersForUser(userId: number) {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        console.log('Fetched Sinisters:', data); // Log the fetched data
  
        // Filter sinisters to only include those with user_id = 1
        const sinistersForUser = data.filter(sinister => sinister.user === userId);
        console.log('Filtered Sinisters:', sinistersForUser); // Log the filtered data
  
        // Format the data as a plain string
        const sinistersString = sinistersForUser.map(sinister => 
          `Date of incident: ${sinister.dateOfIncident}\n` +
          `Description: ${sinister.description}\n` +
          `Status: ${sinister.status}\n` +
          `Type: ${sinister.typeInsurance}\n` +
          `date of creation: ${sinister.dateofcreation}\n` +
          '-------------------------'
        ).join('\n');
  
        console.log('QR Code Data:', sinistersString); // Log the formatted string
  
        // Generate the QR code
        this.generateQRCode(sinistersString);
      },
      error: (error) => {
        console.error('Error fetching sinisters:', error);
      }
    });
  }

  // Generate the QR code
  async generateQRCode(data: string) {
    try {
      this.qrCodeImage = await toDataURL(data, {
        width: 256, // Size of the QR code
        margin: 1,  // Margin around the QR code
        color: {
          dark: '#000000', // QR code color
          light: '#ffffff' // Background color
        }
      });
      console.log('QR Code Image:', this.qrCodeImage); // Log the generated image URL
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
}