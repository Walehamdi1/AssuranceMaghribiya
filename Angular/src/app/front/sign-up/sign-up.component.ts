import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  userData: any = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthday: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) { }

  signUp(): void {
    var x =this.userData.phoneNumber
    if(this.userData.firstName===''){
      alert("Please enter your first name");
    }else if(this.userData.lastName==='')
      {
        alert("Please enter your last name");
      }
    else if(x.length<8){
        alert("Please enter a valid phone number");
      }
    else if(this.userData.birthday===''){
        alert("Please enter your birthday");
      }
    else if(this.userData.email===''){
        alert("Please enter your email");
      }
    else if(this.userData.password===''){
        alert("Please enter your password");
      }
    else{
      this.authService.signUp(this.userData)
      .subscribe(
        response => {
          // Handle successful sign up response
          window.location.href = '/signin';
        },
        error => {
          // Handle sign up error
          console.error('Sign up failed:', error);
          // Optionally, display an error message to the userrrr
          alert("Credentials Must Be Valid")
        }
      );
    }
    
  }

  ngOnInit(): void {
  }



}

