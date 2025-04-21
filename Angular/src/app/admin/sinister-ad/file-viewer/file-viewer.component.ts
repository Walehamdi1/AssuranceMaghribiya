import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {
  fileUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadCurrentUser();

    this.route.queryParams.subscribe(params => {
      const filePath = params['file'];
      console.log('File Path:', filePath); // Debugging
      if (filePath) {
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
      }
    });
  }

  loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
        console.log('✅ Current User Loaded:', this.currentUser);
      } catch (e) {
        console.error('❌ Failed to parse user from localStorage:', e);
      }
    } else {
      console.warn('⚠️ No user found in localStorage');
    }
  }
}
