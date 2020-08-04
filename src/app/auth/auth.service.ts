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

  constructor(private http: HttpClient, private router: Router) {}

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
      .post<{ token: string; tokenExpiresIn: number }>(
        'http://localhost:3000/users/login',
        {
          email: data.email,
          password: data.password,
        }
      )
      .subscribe(({ token, tokenExpiresIn }) => {
        if (token.length > 0) {
          this.setAuthTimer(tokenExpiresIn);
          this.setToken(token);
          const expireDate = new Date().getTime() + tokenExpiresIn * 1000;
          this.saveAuthData(token, new Date(expireDate));
          this.router.navigate(['/']);
        }
      });
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDate = localStorage.getItem('expiration');

    if (!token || !expireDate) {
      return;
    }

    return {
      token,
      expireDate: new Date(expireDate),
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
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthSubject.next(true);
    }
  }
}
