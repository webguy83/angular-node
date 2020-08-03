import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
  constructor(private http: HttpClient) {}

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
