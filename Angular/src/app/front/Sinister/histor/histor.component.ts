import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-histor',
  templateUrl: './histor.component.html',
  styleUrls: ['./histor.component.css']
})
export class HistorComponent {
  sinisters: Sinister[] = []; // Array to store sinisters for user_id = 1

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sinistersService: SinistersService
  ) {}

  ngOnInit() {
    this.loadSinistersForUser(1); // Load sinisters for user_id = 1
  }

  loadSinistersForUser(userId: number) {
    this.sinistersService.getSinisters().subscribe({
      next: (data) => {
        // Filter sinisters to only include those with user_id = 1
        this.sinisters = data.filter(sinister => sinister.user === userId);
      },
      error: (error) => {
        console.error('Error fetching sinisters:', error);
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
  onCardClick(event: MouseEvent, sinisterId: number) {
    // Check if the click target is a button or inside a button
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
      return; // Do nothing if the click is on a button
    }

    // Navigate to the sinister-details route
    this.router.navigate(['/sinisterdetails', sinisterId]);
  }

  goBack() {
    this.router.navigate(['/sinister-ad']);
  }
}