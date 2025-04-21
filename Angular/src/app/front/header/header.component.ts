import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  admin: boolean = false; 
 

  constructor(private router: Router,@Inject(CookieService) private cookieService: CookieService ) { }
  async logout():  Promise<void> {
    // Method to handle user logout
    // Clear the token from cookies
    await this.cookieService.delete('token');
    // Update isLoggedIn property
    this.isLoggedIn = false;
    this.router.navigate(['/signin'])
    alert("logged out")
    // Implement any other logout logic here
  }
  ngOnInit(): void {
    
  }

}
