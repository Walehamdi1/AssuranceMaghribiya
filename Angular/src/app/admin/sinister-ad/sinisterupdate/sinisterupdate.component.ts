import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sinisterupdate',
  templateUrl: './sinisterupdate.component.html',
  styleUrls: ['./sinisterupdate.component.css']
})
export class SinisterupdateComponent implements OnInit {
  sinisterForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    location: new FormControl(''),
    typeInsurance: new FormControl(''),
    status: new FormControl('PENDING'),
  });

  sinister: Sinister = {} as Sinister;
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
          if (!data.dateOfIncident) {
            data.dateOfIncident = new Date();
          }
          this.sinisterForm.patchValue(data);
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
        console.log('✅ Current user loaded:', this.currentUser);
      } catch (e) {
        console.error('❌ Failed to parse user from localStorage:', e);
      }
    }
  }

  onSubmit() {
    if (this.sinisterForm.valid && this.currentUser) {
      const updatedSinister: Sinister = {
        ...this.sinister,
        ...this.sinisterForm.value,
        dateOfIncident: this.sinister.dateOfIncident ?? new Date()
      };

      console.log("Sending update request:", updatedSinister);
      
      this.sinistersService.updateSinister(
        this.sinister.id,
        this.currentUser.id,
        this.currentUser.email,
        updatedSinister
      ).subscribe({
        next: () => {
          this.router.navigate(['/admin/sinister']);
        },
        error: (error) => {
          console.error("Error updating sinister:", error);
          alert("Failed to update sinister. Please check your inputs.");
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/sinister']);
  }
}
