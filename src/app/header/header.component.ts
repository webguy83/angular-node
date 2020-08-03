import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  sub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.sub = this.authService.getAuthStatusListener().subscribe((isAuth) => {
      this.isAuth = isAuth;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLogOut() {
    // this.isAuth = false;
    // this.authService.deleteToken();
  }
}
