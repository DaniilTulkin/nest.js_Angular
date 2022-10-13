import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserData } from '../interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findAll(page: number, limit: number): Observable<UserData> {
    const params = {page, limit};

    return this.http.get<UserData>('/api/users', {params}).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(() => new Error(err)))
    )
  }
}
