import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { each, get } from 'lodash-es';
import {
  ToasterService,
  ToastStatus,
} from 'src/app/core/toaster/toaster.service';
import {
  ReadSign,
  ScheduleStatus,
  Sign,
  SignService,
} from 'src/app/signs/sign.service';

interface SelectValue {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sign-table-admin',
  templateUrl: './sign-table-admin.component.html',
  styleUrls: ['./sign-table-admin.component.scss'],
})
export class SignTableAdminComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({});
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;

  // date and time format can have "style" options (i.e. full, long, medium, short)
  enGBFormatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    // timeStyle: 'medium',
  });

  displayedColumns: string[] = [
    'postalCode',
    'city',
    'houseNumber',
    'address',
    'readSign',
    'createdAt',
    'status',
    'createdBy',
    'scheduleAt',
    'scheduleTo',
    'schedule',
    'note'
  ];
  // dataSource: MatTableDataSource<Sign> = new MatTableDataSource(undefined);
  dataSource: Sign[] = [];

  userSelectValues: SelectValue[] = [
    {
      value: 'c88ac485-f823-4418-b1dd-e0e66a9af631',
      viewValue: 'Company Test',
    },
  ];

  constructor(
    private signService: SignService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  @ViewChild('empTbSort') sort = new MatSort();

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    console.log('ngAfterViewInit');
  }

  ngOnInit(): void {
    this.signService.fetchSigns().subscribe(value => {
      const items = value.items;
      each(items, item => {
        let cAt: Date = new Date(item.createdAt ?? '');
        item.createdAt = this.enGBFormatter.format(cAt);
        item.readSign = this.prettyReadSign(item.readSign);

        // if (item.scheduleAt) {
        //   let sAt: Date = new Date(item.scheduleAt ?? '');
        //   item.scheduleAt = this.enGBFormatter.format(sAt);
        // }
      });
      // this.dataSource = new MatTableDataSource(items);
      this.dataSource = items;
      console.log(this.dataSource);
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

  handleEdit(sign: any) {
    console.log('PEDIU SCHEDULE: ', sign);
    if (sign.status == ScheduleStatus.scheduled) return;

    if (!sign.scheduleAt || sign.scheduleAt == '') {
      this.toasterService.toast(
        ToastStatus.error,
        'Missing date for Schedule work!'
      );
      return;
    }

    if (!sign.scheduleTo || sign.scheduleTo == '') {
      this.toasterService.toast(
        ToastStatus.error,
        'Missing user to Schedule work!'
      );
      return;
    }

    if (sign.status == 'pending') {
      // this.router.navigate(['admin', 'sign', sign.signID]);
      console.log('PEDIU SCHEDULE: ', sign);

      let updateSign = {
        id: sign.id,
        status: ScheduleStatus.scheduled,
        scheduleAt: sign.scheduleAt,
        scheduleTo: sign.scheduleTo,
      };

      let handleError = (error: Error) => {
        // this.isLoading = false;
        this.toasterService.toast(ToastStatus.error, 'Try again later.');
        console.error('Error!: ', error);
      };

      sign.status = ScheduleStatus.scheduled;
      this.signService.scheduleSign(updateSign).subscribe({
        next: sign => {
          // this.isLoading = false;
          console.log('Created! SIGN: ', sign);
          this.toasterService.toast(ToastStatus.success, 'Edit sucessful');
          // this.router.navigate(['admin', 'signs']);
        },
        error: error => handleError(error),
      });
    }
  }

  handleShowNote(sign: Sign) {
    console.log(sign)
    sign.hasNotes = true
   }
 

  scheduleToValueChange(value: string, element: any) {
    element.scheduleTo = value;
    console.log(element, value);
    // element.scheduleTo = value;
  }

  scheduleAtValueChange(event: any, element: any) {
    element.scheduleAt = event.value.toISOString();
    console.log(element);
    // element.scheduleAt = value;
    // console.log(element, value);
    // element.scheduleTo = value;
  }

  handleNew() {
    this.router.navigate(['admin', 'sign']);
  }

  getUserName(element: any) {
    return get(element.createdBy, ['name'], 'ErrorName');
  }
}
