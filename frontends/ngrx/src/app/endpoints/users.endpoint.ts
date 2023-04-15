import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';

@Injectable()
export class UsersEndpoint {
  constructor(private _http: HttpClient) {}

  getUsers(
    amount: string,
  ): Observable<User[]> {
    performance.mark('fetch_api_start');
    const url = `http://localhost:3000/${amount}`;
    return this._http.get<User[]>(url).pipe(tap(() => performance.mark('fetch_api_end')));
  }

  deleteUsers(
    users: User[],
  ): Observable<User[]> {
    const url = `http://localhost:3000/delete`;
    return this._http.delete<User[]>(url, {body: users});
  }

  updateUsers(
    users: User[],
  ): Observable<User[]> {
    const url = `http://localhost:3000/update`;
    return this._http.put<User[]>(url, users);
  }

  updateLog(time: number, type: string): Observable<any> {
    const url = `http://localhost:3000/log`;
    return this._http.put<any>(url, {sma: 'ngrx', type, time});
  }
}
