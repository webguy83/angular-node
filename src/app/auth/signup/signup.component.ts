import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService],
})
export class SignupComponent {
  isLoading = false;
  emailInput = '';
  passwordInput = '';

  constructor(private authService: AuthService) {}

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .createUser(form.value.email, form.value.password)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
