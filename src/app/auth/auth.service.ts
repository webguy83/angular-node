import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  setToken(token: string) {
    this.token = token;
    this.isAuthSubject.next(true);
  }

  getAuthStatusListener() {
    return this.isAuthSubject.asObservable();
  }

  getToken() {
    return this.token;
  }

  deleteToken() {
    // this.token = '';
    // this.isAuthSubject.next(false);
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
    return this.http.post<{ token: string }>(
      'http://localhost:3000/users/login',
      {
        email: data.email,
        password: data.password,
      }
    );
  }
}
