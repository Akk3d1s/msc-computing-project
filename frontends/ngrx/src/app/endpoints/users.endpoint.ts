import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsersEndpoint {
  constructor(private _http: HttpClient) {}

  getUsers(
    amount: string,
  ): Observable<User[]> {
    performance.mark('fetch_api_start');
    const url = `${environment.baseUrl}/${amount}`;
    return this._http.get<User[]>(url).pipe(tap(() => performance.mark('fetch_api_end')));
  }

  updateLog(value: number, type: string): Observable<any> {
    const url = `${environment.baseUrl}/log`;
    return this._http.put<any>(url, {sma: 'ngrx', type, value});
  }
}
