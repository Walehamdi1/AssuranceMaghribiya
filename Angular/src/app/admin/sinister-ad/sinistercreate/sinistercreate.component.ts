import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SinistersService } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-sinistercreate',
  templateUrl: './sinistercreate.component.html',
  styleUrls: ['./sinistercreate.component.css']
})
export class SinistercreateComponent {
  sinister: any = {};

  constructor(private sinistersService: SinistersService, private router: Router) {}

  onSubmit() {
    this.sinistersService.createClaim(this.sinister, this.sinister.document).subscribe({
      next: () => {
        this.router.navigate(['/sinister-ad']);
      },
      error: (error) => {
        console.error('Error creating sinister:', error);
      }
    });
  }
}
