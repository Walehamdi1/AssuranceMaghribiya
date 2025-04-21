import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, SinisterDetail } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-sinister-details',
  templateUrl: './sinister-details.component.html',
  styleUrls: ['./sinister-details.component.css']
})
export class SinisterDetailsComponent {
  sinisterDetails: SinisterDetail[] = []; // Array to store sinister details

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sinistersService: SinistersService
  ) {}

  ngOnInit() {
    const sinisterId = this.route.snapshot.paramMap.get('id');
    if (sinisterId) {
      this.loadSinisterDetails(+sinisterId); // Load details for the selected sinister
    }
  }

  loadSinisterDetails(sinisterId: number) {
    this.sinistersService.getSinisterDetailsBySinisterId(sinisterId).subscribe({
      next: (details) => {
        this.sinisterDetails = details;
      },
      error: (error) => {
        console.error('Error fetching sinister details:', error);
      }
    });
  }
  openFile(filePath: string) {
    this.router.navigate(['/view-file'], { queryParams: { file: filePath } });
  }
  downloadFile(sinisterDetailId: number) {
    // Construct the URL to the Spring endpoint
    const downloadUrl = `http://localhost:8069/api/admin/sinisters/files/${sinisterDetailId}`;
  
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'file.pdf'; // Set a default file name for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
  }

  goBack() {
    this.router.navigate(['/track']);
  }
}