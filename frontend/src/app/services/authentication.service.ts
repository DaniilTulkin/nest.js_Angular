import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm) {
    return this.http.post<any>('api/users/login', loginForm).pipe(
      map((token) => {
        localStorage.setItem('token', token['access_token']);
        return token;
      })
    )
  }

  register(user: User) {
    return this.http.post<any>('api/users/', user).pipe(
      map(user => user)
    )
  }
}
