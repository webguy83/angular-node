import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
