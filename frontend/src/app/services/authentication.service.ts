import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'

import { User } from '../interfaces/user.interface';
import { LoginForm } from '../interfaces/login-form.interface';

export const JWT_TOKEN ='token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
              private jwtHelperService: JwtHelperService) { }

  login(loginForm: LoginForm) {
    return this.http.post<any>('api/users/login', loginForm).pipe(
      map((token) => {
        localStorage.setItem(JWT_TOKEN, token['access_token']);
        return token;
      })
    )
  }

  register(user: User) {
    return this.http.post<any>('api/users/', user).pipe(
      map(user => user)
    )
  }

  isAuthenticated() {
    const token = localStorage.getItem(JWT_TOKEN) as string;
    return !this.jwtHelperService.isTokenExpired(token);
  }
}
