import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { has, isObject } from 'lodash-es';
import {
  ToasterService,
  ToastStatus,
} from 'src/app/core/toaster/toaster.service';
import { User } from 'src/app/core/user';
import { validateUUID } from 'src/app/core/utils';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      let loginData = this.loginForm.value;
      this.sessionService
        .login(loginData.email || null, loginData.password || null)
        .subscribe({
          next: user => {
            this.handleUser(user);
          },
          error: error => {
            this.toasterService.toast(
              ToastStatus.warning,
              'Check your email and password',
              'Login failed'
            );
          },
        });
    }
  }

  handleUser(user: Partial<User>) {
    if (isObject(user) && has(user, 'id') && validateUUID(user.id ?? '')) {
      this.router.navigate(['/']);
    }
  }
}
