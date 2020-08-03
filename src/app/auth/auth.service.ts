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
    this.router.navigate(['/']);
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
    return this.http.post<{ token: string; tokenExpiresIn: number }>(
      'http://localhost:3000/users/login',
      {
        email: data.email,
        password: data.password,
      }
    );
  }
}
