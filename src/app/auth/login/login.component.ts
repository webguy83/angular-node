import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  emailInput = '';
  passwordInput = '';
  isAuthSub: Subscription;

  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.isAuthSub = this.authService.getAuthStatusListener().subscribe(() => {
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    this.isAuthSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
