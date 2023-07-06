import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../core/loading-spinner/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  totalRequests = 0;
  completedRequests = 0;

  constructor(
    private router: Router,
    private readonly loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    });
    this.loadingService.show();
    this.totalRequests++;
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
          }
        },
        (err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.router.navigate(['login']);
            }
          }
        }
      ),
      finalize(() => {
        this.completedRequests++;
        // console.log(this.completedRequests, this.totalRequests);
        if (this.completedRequests === this.totalRequests) {
          this.loadingService.hide();
          this.completedRequests = 0;
          this.totalRequests = 0;
        }
      })
    );
  }
}
