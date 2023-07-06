import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastComponent } from './toast.component';

export enum ToastStatus {
  success = 0,
  warning = 1,
  error = 2,
}

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  duration = 5;

  constructor(private snackBar: MatSnackBar) {}

  toast(
    type: ToastStatus = ToastStatus.success,
    message: string = '',
    title?: string
  ) {
    if (!title) {
      title =
        type === ToastStatus.success
          ? (title = 'Success')
          : type === ToastStatus.warning
          ? (title = 'Warning')
          : type === ToastStatus.error
          ? (title = 'Error')
          : (title = 'Unknow');
    }

    const configSuccess: MatSnackBarConfig = {
      panelClass: ['snackbar-panel', `t${type}`],
      duration: this.duration * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    };

    this.snackBar.openFromComponent(ToastComponent, {
      data: {
        title,
        description: message,
        type,
      },
      ...configSuccess,
    });
  }
}
