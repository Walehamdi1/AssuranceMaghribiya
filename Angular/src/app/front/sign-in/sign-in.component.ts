import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(): void {
    if (!this.email.trim()) {
      alert('Please enter your email');
      return;
    }

    if (!this.password.trim()) {
      alert('Please enter your password');
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Save token and user in localStorage
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }

        // Decode and check role
        const decodedToken = this.decodeToken(response.token);
        if (decodedToken?.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else if (decodedToken?.role === 'ROLE_USER') {
          this.router.navigate(['/dashboard']);
        } else {
          alert('Unknown role. Access denied.');
          this.router.navigate(['/signin']);
        }
      },
      (error) => {
        alert('Email or Password Incorrect');
        console.error('Login error:', error);
      }
    );
  }

  decodeToken(token: string): any {
    try {
      const tokenPayload = token.split('.')[1];
      return JSON.parse(atob(tokenPayload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
