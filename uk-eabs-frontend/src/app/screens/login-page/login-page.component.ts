import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isLoading: boolean = true;
  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.refresh().subscribe({
      next: user => {
        console.log('LOGIN PAGE USER: ', user);
        this.router.navigate(['']);
      },
      error: error => {
        console.error('LOGIN PAGE ERROR', error);
        // this.loginError = error.statusText;
      },
    });
  }
}
