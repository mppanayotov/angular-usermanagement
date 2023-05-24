import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UsersEntity } from '../+state/users.models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<Array<UsersEntity>> {
    return this.http
      .get<UsersEntity[]>(
        'https://my-json-server.typicode.com/mppanayotov/mock-api/users'
      )
      .pipe(
        tap(() => console.log('fetched users')),
        catchError((err) => {
          throw 'error in fethching users. Details: ' + err;
        })
      );
  }
}
