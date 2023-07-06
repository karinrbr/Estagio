import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { isEmpty } from 'lodash-es';
import { SessionService, UserRole } from './auth/session.service';
import { LoadingService } from './core/loading-spinner/loading.service';
import { User } from './core/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading$ = this.loadingService.loading$;
  isLoading: boolean = false;

  constructor(
    private readonly loadingService: LoadingService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading$.subscribe({
      next: (value: boolean) => {
        this.isLoading = value;
        this.cdr.detectChanges();
      },
    });

    // this.sessionService.getMe().subscribe({
    //   next: (user: User) => {
    //     console.log('INIT ROOT PAGE: ', user);
    //     this.sessionService.setUser(user);
    //     console.log("ROUTE APP: ", this.router.url)
    //     if(this.router.url === '/') {
    //       if (user.role == UserRole.agent) {
    //         this.router.navigate(['agent', 'dashboard']);
    //       } else if (
    //         user.role == UserRole.administrator ||
    //         user.role == UserRole.company
    //       ) {
    //         this.router.navigate(['admin', 'dashboard']);
    //       } else {
    //         this.router.navigate(['404']);
    //       }
    //     }
    //   },
    // });

    let user = this.sessionService.getUser();
    if (!isEmpty(user)) {
      console.log('INIT ROOT PAGE: ', user);
      console.log('ROUTE APP: ', this.router.url);
      if (this.router.url === '/') {
        if (user.role == UserRole.agent) {
          this.router.navigate(['agent', 'dashboard']);
        } else if (
          user.role == UserRole.administrator ||
          user.role == UserRole.company
        ) {
          this.router.navigate(['admin', 'dashboard']);
        } else {
          this.router.navigate(['404']);
        }
      }
    }
  }
}
