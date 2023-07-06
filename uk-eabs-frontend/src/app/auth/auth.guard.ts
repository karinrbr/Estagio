import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { has, split } from 'lodash-es';
import { Observable } from 'rxjs';
import { User } from '../core/user';
import { validateUUID } from '../core/utils';
import { SessionService, UserRole } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router
  ) {}

  validateUser(value: User): boolean {
    return value && has(value, 'id') && validateUUID(value.id ?? '');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, _) => {
      // resolve(false);
      // let user = this.sessionService.getUser();
      // if (!user) {
      //   reject(Error('canActivate: User not found in SessionService'));
      // } else {
      //   resolve(this.validateUser(user));
      // }

      console.log('canActivate INIT: ', state);
      // this.sessionService.getMe().toPromise().then((user) => {
      //   console.log('canActivate NEXT: ', user);
      //   if(!user) {
      //     this.sessionService.setUser(null);
      //     reject(Error('canActivate: User not found in SessionService'));
      //   } else {
      //     this.sessionService.setUser(user);
      //     resolve(this.validateUser(user));
      //   }
      // })
      this.sessionService.getMe().subscribe({
        next: user => {
          if (!user) {
            this.sessionService.setUser(null);
            resolve(false);
          } else {
            this.sessionService.setUser(user);
            // resolve(this.validateUser(user));
          }
        },
        error: error => {
          console.error(error);
          resolve(false);
        },
        complete: () => {
          resolve(true);
        },
      });
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    console.log('canActivateChild INIT: ', split(state.url, '/'));
    let user = this.sessionService.getUser();
    if (!user) {
      this.router.navigate(['login']);
      return false;
    }

    let stateUrl = split(state.url, '/');
    if (stateUrl[1] == 'admin') {
      let isAuthorized =
        user.role == UserRole.administrator || user.role == UserRole.company;
      if (!isAuthorized) {
        this.router.navigate(['404']);
      }
      return isAuthorized;
    }

    if (stateUrl[1] == 'agent') {
      let isAuthorized = user.role == UserRole.agent;
      if (!isAuthorized) {
        this.router.navigate(['404']);
      }
      return isAuthorized;
    }

    this.router.navigate(['404']);
    return false;
  }
}
