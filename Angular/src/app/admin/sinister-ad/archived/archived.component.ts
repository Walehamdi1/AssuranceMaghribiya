import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.css']
})
export class ArchivedComponent implements OnInit {
  archivedSinisters: Sinister[] = [];
  userMap: { [key: number]: string } = {}; // userId => "Full Name"

  constructor(
    private sinistersService: SinistersService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadArchivedSinisters();
  }

  private loadArchivedSinisters() {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      console.error('User not authenticated.');
      return;
    }
  
    const currentUser = JSON.parse(storedUser);
    const userId = currentUser.id;
  
    this.sinistersService.getSinistersByUser().subscribe({
      next: (data) => {
        this.archivedSinisters = data.filter(s => s.status?.toUpperCase() === 'ARCHIVED');
  
        this.archivedSinisters.forEach(sinister => {
          if (sinister.user && typeof sinister.user === 'number') {
            this.userService.getUser(sinister.user).subscribe({
              next: (userData) => {
                this.userMap[sinister.user] = userData.firstName + ' ' + userData.lastName;
              },
              error: (error) => {
                console.error(`Error fetching user ${sinister.user}:`, error);
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching archived sinisters:', error);
      }
    });
  }
  
  getUserName(userId: number): string {
    return this.userMap[userId] || 'Unknown';
  }

  unarchiveSinister(id: number) {
    this.sinistersService.toggleArchiveSinister(id).subscribe({
      next: () => this.loadArchivedSinisters(),
      error: (error) => console.error('Error unarchiving sinister:', error)
    });
  }
}
