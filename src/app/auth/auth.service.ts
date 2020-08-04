import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

interface IUserCredResponse {
  message: string;
  result: {
    _id: string;
    email: string;
    password: string;
    __v: number;
  };
}

interface IAuthData {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  private isAuthSubject = new Subject<boolean>();
  isAuth = false;
  tokenTimer: number;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getUserId() {
    return this.userId;
  }

  setToken(token: string) {
    this.token = token;
    this.isAuthSubject.next(true);
    this.isAuth = true;
  }

  getAuthStatusListener() {
    return this.isAuthSubject.asObservable();
  }

  getToken() {
    return this.token;
  }

  onLogOut() {
    clearTimeout(this.tokenTimer);
    this.token = '';
    this.isAuthSubject.next(false);
    this.isAuth = false;
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.onLogOut();
    }, duration * 1000);
  }

  createUser(email: string, password: string) {
    const data: IAuthData = { email, password };
    return this.http.post<IUserCredResponse>(
      'http://localhost:3000/users/signup',
      {
        email: data.email,
        password: data.password,
      }
    );
  }

  loginUser(email: string, password: string) {
    const data: IAuthData = { email, password };
    return this.http
      .post<{ token: string; tokenExpiresIn: number; userId: string }>(
        'http://localhost:3000/users/login',
        {
          email: data.email,
          password: data.password,
        }
      )
      .subscribe(({ token, tokenExpiresIn, userId }) => {
        if (token.length > 0) {
          this.userId = userId;
          this.setAuthTimer(tokenExpiresIn);
          this.setToken(token);
          const expireDate = new Date().getTime() + tokenExpiresIn * 1000;
          this.saveAuthData(token, new Date(expireDate), this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expireDate) {
      return;
    }

    return {
      token,
      expireDate: new Date(expireDate),
      userId,
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const expiresIn = authInfo.expireDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuth = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthSubject.next(true);
    }
  }
}
