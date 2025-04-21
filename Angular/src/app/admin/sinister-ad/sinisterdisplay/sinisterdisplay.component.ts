import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, Sinister, SinisterDetail } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-sinisterdisplay',
  templateUrl: './sinisterdisplay.component.html',
  styleUrls: ['./sinisterdisplay.component.css']
})
export class SinisterdisplayComponent {
  sinister: Sinister = {} as Sinister;
  sinisterDetails: SinisterDetail[] = [];
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sinistersService: SinistersService
  ) {}

  ngOnInit() {
    this.loadCurrentUser();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sinistersService.getSinisterById(+id).subscribe({
        next: (data) => {
          this.sinister = data;
          this.loadSinisterDetails(+id);
        },
        error: (error) => {
          console.error('Error fetching sinister:', error);
          this.goBack();
        }
      });
    }
  }

  loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
        console.log('✅ Loaded currentUser:', this.currentUser);
      } catch (e) {
        console.error('❌ Failed to parse currentUser from localStorage:', e);
      }
    }
  }

  loadSinisterDetails(id: number) {
    this.sinistersService.getSinisterDetailsBySinisterId(id).subscribe({
      next: (details) => {
        this.sinisterDetails = details;
      },
      error: (error) => {
        console.error('Error fetching sinister details:', error);
      }
    });
  }

  updateSinisterStatus(newStatus: string) {
    const id = this.sinister.id;
    if (id && this.currentUser) {
      this.sinister.status = newStatus;

      this.sinistersService.updateSinister(
        id,
        this.currentUser.id,
        this.currentUser.email,
        this.sinister
      ).subscribe({
        next: (updatedSinister) => {
          this.sinister = updatedSinister;
          this.loadSinisterDetails(id);
        },
        error: (error) => {
          console.error('Error updating sinister:', error);
        }
      });
    }
  }

  openFile(filePath: string) {
    this.router.navigate(['/view-file'], { queryParams: { file: filePath } });
  }

  downloadFile(sinisterDetailId: number) {
    const downloadUrl = `http://localhost:8069/api/admin/sinisters/details/files/${sinisterDetailId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'file.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goBack() {
    this.router.navigate(['/sinister-ad']);
  }
}
