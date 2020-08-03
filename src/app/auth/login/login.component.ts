import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoading = false;
  emailInput = '';
  passwordInput = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    this.authService
      .loginUser(form.value.email, form.value.password)
      .subscribe(({ token, tokenExpiresIn }) => {
        if (token.length > 0) {
          this.authService.tokenTimer = setTimeout(() => {
            this.authService.onLogOut();
          }, tokenExpiresIn * 1000);
          this.authService.setToken(token);
          this.router.navigate(['/']);
        }
      });
  }
}
