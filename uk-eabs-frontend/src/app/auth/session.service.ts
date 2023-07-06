import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { assign } from 'lodash-es';
import { User } from '../core/user';

export enum UserRole {
  administrator = 'dss-admin',
  agent = 'dss-agent',
  company = 'dss-company',
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private user: User | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  getUser(): User {
    console.log('SessionService: getUser called');
    return assign({}, this.user);
  }

  setUser(value: User | null) {
    console.log('SessionService: setUser ', value);
    this.user = value;
  }

  login(username: string | null, password: string | null) {
    return this.http
      .post<User>(`${environment.backendUrl}/v0/auth/login`, {
        username,
        password,
      })
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('user', JSON.stringify(user));
          // this.userSubject.next(user);
          this.setUser(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    // localStorage.removeItem('user');
    //this.userSubject.next(undefined);
    return this.http
      .post<User>(`${environment.backendUrl}/v0/auth/logout`, {})
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('user', JSON.stringify({}));
          // this.userSubject.next(undefined);
          this.setUser(null);
          return user;
        })
      );
  }

  // register(user: User) {
  //   return this.http.post(`${environment.backendUrl}/users/register`, user);
  // }

  getMe() {
    return this.http.get<User>(`${environment.backendUrl}/v0/auth/jwt/me`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.backendUrl}/v0/user/${id}`);
  }

  refresh() {
    return this.http.get<User>(`${environment.backendUrl}/v0/auth/jwt/refresh`);
  }

  // update(id: string, params: any) {
  //   return this.http.put(`${environment.backendUrl}/users/${id}`, params).pipe(
  //     map((x) => {
  //       // update stored user if the logged in user updated their own record
  //       if (id == this.userValue.id) {
  //         // update local storage
  //         const user = { ...this.userValue, ...params };
  //         localStorage.setItem('user', JSON.stringify(user));

  //         // publish updated user to subscribers
  //         this.userSubject.next(user);
  //       }
  //       return x;
  //     })
  //   );
  // }

  // delete(id: string) {
  //   return this.http.delete(`${environment.backendUrl}/users/${id}`).pipe(
  //     map((x) => {
  //       // auto logout if the logged in user deleted their own record
  //       if (id == this.userValue.id) {
  //         this.logout();
  //       }
  //       return x;
  //     })
  //   );
  // }
}
