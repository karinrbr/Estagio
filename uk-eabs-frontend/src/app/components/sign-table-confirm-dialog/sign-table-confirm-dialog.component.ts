import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { assign } from 'lodash-es';
import { Subscription } from 'rxjs';
import {
  ToasterService,
  ToastStatus,
} from 'src/app/core/toaster/toaster.service';
import { SignService } from 'src/app/signs/sign.service';

@Component({
  selector: 'app-sign-table-confirm-dialog',
  templateUrl: './sign-table-confirm-dialog.component.html',
  styleUrls: ['./sign-table-confirm-dialog.component.scss'],
})
export class SignTableConfirmDialogComponent implements OnInit {
  signId: string = '';

  createSignSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<SignTableConfirmDialogComponent>,
    private readonly signService: SignService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  handleCancel(): void {
    console.log('NO CLICK');
    this.dialogRef.close();
  }

  handleConfirm(): void {
    console.log('YES CLICK', this.data);

    let handleError = (error: Error) => {
      // this.isLoading = false;
      this.toasterService.toast(ToastStatus.error, 'Try again later.');
      console.error('Error!: ', error);
      this.dialogRef.close();
    };

    this.createSignSubscription = this.signService
      .deleteSign(this.data.signId)
      .subscribe({
        next: sign => {
          // this.isLoading = false;
          console.log('Created! SIGN: ', sign);
          this.toasterService.toast(ToastStatus.success, 'Delete sucessful');
          this.dialogRef.close();
          this.router.navigate(['agent', 'signs']);
          window.location.reload();
        },
        error: error => handleError(error),
      });
    // this.dialogRef.close();
  }
}
