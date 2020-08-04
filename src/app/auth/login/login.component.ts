import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoading = false;
  emailInput = '';
  passwordInput = '';

  constructor(private authService: AuthService) {}

  onLogin(form: NgForm) {
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
