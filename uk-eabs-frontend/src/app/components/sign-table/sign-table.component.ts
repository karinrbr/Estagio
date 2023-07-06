import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { each, filter, assign, omit } from 'lodash-es';
import { Subscription } from 'rxjs';
import { ToasterService, ToastStatus } from 'src/app/core/toaster/toaster.service';
import { ReadSign, Sign, SignService } from 'src/app/signs/sign.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignTableConfirmDialogComponent } from '../sign-table-confirm-dialog/sign-table-confirm-dialog.component';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-sign-table',
  templateUrl: './sign-table.component.html',
  styleUrls: ['./sign-table.component.scss'],
})
export class SignTableComponent implements OnInit, AfterViewInit {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  @Input() usingCollectSettings = false
  // date and time format can have "style" options (i.e. full, long, medium, short)
  enGBFormatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    // timeStyle: 'medium',
  });

  displayedColumns: string[] = [];
  // dataSource: MatTableDataSource<Sign> = new MatTableDataSource(undefined);
  dataSource: Sign[] = [];

  updateSignSubscription?: Subscription;

  animal: string = "";
  name: string = "";

  constructor(
    private signService: SignService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private readonly toasterService: ToasterService,
    public dialog: MatDialog
  ) { }

  @ViewChild('empTbSort') sort = new MatSort();

  openDialog(signId: string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SignTableConfirmDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        signId
      }
    });
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    console.log('ngAfterViewInit');
  }

  ngOnInit(): void {
    if (this.usingCollectSettings) {
      this.displayedColumns = [
        'postalCode',
        'city',
        'houseNumber',
        'address',
        'readSign',
        'createdAt',
        'workType',
        'action_re_erect',
        'action_collect',
        'action_change_slip']
    } else {
      this.displayedColumns = [
        'postalCode',
        'city',
        'houseNumber',
        'address',
        'readSign',
        'createdAt',
        'workType',
        'status',
        'edit',
        // 'note',
        'delete'
      ]
    }
    this.fetchSigns()
  }

  fetchSigns() {
    this.signService.fetchUserSigns().subscribe(value => {
      const items = value.items;
      each(items, item => {
        let cAt: Date = new Date(item.createdAt ?? '');
        item.createdAt = this.enGBFormatter.format(cAt);
        item.readSign = this.prettyReadSign(item.readSign);
      });
      // this.dataSource = new MatTableDataSource(items);
      this.dataSource = items;
      console.log(this.dataSource);
      if (this.usingCollectSettings) {
        this.dataSource = filter(this.dataSource, e => e.status == 'pending')
      }
    });
  }

  prettyReadSign(readValue: string): string {
    if (readValue == ReadSign.letBy) {
      return 'Let By';
    }
    if (readValue == ReadSign.toLet) {
      return 'To Let';
    }
    if (readValue == ReadSign.sale) {
      return 'Sale';
    }
    if (readValue == ReadSign.sold) {
      return 'Sold';
    }
    return 'ERROR';
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  handleEdit(signId: string, signStatus: string) {
    if (signStatus == 'pending') {
      this.router.navigate(['agent', 'request', 'sign', signId]);
    }
  }

  handleDelete(signId: string, signStatus: string) {
    if (signStatus == 'pending') {
      this.openDialog(signId, '0ms', '0ms')
    }
  }

  handleEdit2(signId: any) {
    // if (signStatus == 'pending') {
    //   this.router.navigate(['agent', 'sign', signId]);
    // }
  }


  handleShowNote(sign: Sign) {
    console.log(sign)
    sign.hasNotes = true
  }

  handleNew() {
    this.router.navigate(['agent', 'sign']);
  }

  handleChangeWorkType(element: Sign, newWorkType: string) {
    let handleError = (error: Error) => {
      // this.isLoading = false;
      this.toasterService.toast(ToastStatus.error, 'Try again later.');
      console.error('Error!: ', error);
    };

    this.updateSignSubscription = this.signService
      .updateSign(assign(omit(element, ['createdBy']), { workType: newWorkType }))
      .subscribe({
        next: sign => {
          // this.isLoading = false;
          // console.log('Created! SIGN: ', sign);
          this.toasterService.toast(ToastStatus.success, 'Edit sucessful');
          this.router.navigate(['agent', 'request', 'change-table']);
          this.fetchSigns()
        },
        error: error => handleError(error),
      });
  }

}
