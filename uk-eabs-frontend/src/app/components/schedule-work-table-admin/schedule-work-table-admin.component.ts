import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { each, groupBy, split, find } from 'lodash-es';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import {
  ReadSign,
  ScheduleStatus,
  Sign,
  SignService,
} from 'src/app/signs/sign.service';
import { MatStepper } from '@angular/material/stepper';
import { pluck } from 'rxjs';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
// ];

interface GroupedSigns {
  groupBy: string;
  signs: Sign[];
}

interface SelectValue {
  value: string;
  viewValue: string;
}

interface PostalCode {
  position: number;
  postalCode: string;
}

@Component({
  selector: 'app-schedule-work-table-admin',
  templateUrl: './schedule-work-table-admin.component.html',
  styleUrls: ['./schedule-work-table-admin.component.scss'],
})
export class ScheduleWorkTableAdminComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  @ViewChild('table') table!: MatTable<Sign>;
  displayedColumnsTable2: string[] = [
    'position',
    'houseNumber',
    'address',
    'city',
    'postalCode',
  ];
  displayedColumnsTable1: string[] = ['position', 'postalCode'];
  // dataSource = ELEMENT_DATA;

  // date and time format can have "style" options (i.e. full, long, medium, short)
  enGBFormatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    // timeStyle: 'medium',
  });

  userSelectValues: SelectValue[] = [
    {
      value: 'c88ac485-f823-4418-b1dd-e0e66a9af631',
      viewValue: 'Company Test',
    },
  ];

  dateSelectValues: SelectValue[] = [];

  dataSource?: MatTableDataSource<Sign> = undefined;

  dataSourceByDate: GroupedSigns[] = [];
  dataSourceBySelectedDate: MatTableDataSource<PostalCode> =
    new MatTableDataSource();

  dataSourceByPostalCode: MatTableDataSource<GroupedSigns> =
    new MatTableDataSource();

  today = new Date();

  @ViewChild('stepper', { static: false }) private stepper!: MatStepper;
  selectedStreamList = [0, 1, 2];

  constructor(
    private signService: SignService,
    private toasterService: ToasterService,
    private _formBuilder: FormBuilder
  ) {}

  firstFormGroup = this._formBuilder.group({
    worker: new FormControl('c88ac485-f823-4418-b1dd-e0e66a9af631', [
      Validators.required,
    ]),
    date: new FormControl('', [Validators.required]),
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = true;

  dropTable(index: number, event: CdkDragDrop<Sign[]>) {
    const prevIndex = this.dataSourceByPostalCode.data[index].signs.findIndex(
      d => d === event.item.data
    );
    moveItemInArray(
      this.dataSourceByPostalCode.data[index].signs || [],
      prevIndex || 0,
      event.currentIndex
    );
    this.table.renderRows();
    console.log('NEW ORDER: ', this.dataSourceByPostalCode.data[index].signs);
  }

  dropTable1(event: CdkDragDrop<PostalCode[]>) {
    const prevIndex = this.dataSourceBySelectedDate.data.findIndex(
      d => d === event.item.data
    );
    moveItemInArray(
      this.dataSourceBySelectedDate.data,
      prevIndex,
      event.currentIndex
    );
    this.table.renderRows();
    console.log('NEW ORDER2: ', this.dataSourceBySelectedDate.data);
  }

  ngOnInit(): void {
    this.signService
      .fetchSigns({ status: ScheduleStatus.scheduled })
      .subscribe(value => {
        const items = value.items;
        each(items, (item, index) => {
          item.position = index;
          let cAt: Date = new Date(item.createdAt ?? '');
          item.createdAt = this.enGBFormatter.format(cAt);
          item.readSign = this.prettyReadSign(item.readSign);

          // if (item.scheduleAt) {
          //   let sAt: Date = new Date(item.scheduleAt ?? '');
          //   item.scheduleAt = this.enGBFormatter.format(sAt);
          // }
        });
        // this.dataSource = new MatTableDataSource(items);
        // this.dataSource = items;
        this.dataSource = new MatTableDataSource(items);
        console.log(this.dataSource);

        // Create Date Form Values
        let signsGroupedByDate = groupBy(this.dataSource.data, sign =>
          this.formatDate(sign.scheduleAt)
        );
        each(signsGroupedByDate, (signs, date) => {
          this.dateSelectValues.push({ value: date, viewValue: date });
          this.dataSourceByDate.push({
            groupBy: date,
            signs,
          });
        });
        console.log(signsGroupedByDate);
      });
  }

  ngAfterViewInit() {
    this.stepper.selectionChange
      .pipe(pluck('selectedIndex'))
      .subscribe((res: number) => {
        console.log('STEP: ', res);

        if (res === 0) {
          // Schedule Step
          this.dataSourceBySelectedDate = new MatTableDataSource();

          this.dataSourceByPostalCode = new MatTableDataSource();
        }

        if (res === 1) {
          // Postal Codes Step
          let date = this.firstFormGroup.value.date?.toString();
          let worker = this.firstFormGroup.value.worker?.toString();

          let signsToThisDate = find(this.dataSourceByDate, { groupBy: date });
          let signsGrouped = groupBy(signsToThisDate?.signs, sign => {
            return split(sign.postalCode, ' ')[0];
          });

          console.log(signsGrouped);
          var position = 0;
          each(signsGrouped, (_, key) => {
            this.dataSourceBySelectedDate.data.push({
              position,
              postalCode: key,
            });
            position += 1;
          });
          console.log('STEP 1: ', this.dataSourceBySelectedDate.data);
        }

        if (res === 2) {
          // Signs Step
          let date = this.firstFormGroup.value.date?.toString();
          let worker = this.firstFormGroup.value.worker?.toString();

          let signsToThisDate = find(this.dataSourceByDate, { groupBy: date });
          let signsGrouped = groupBy(signsToThisDate?.signs, sign => {
            return split(sign.postalCode, ' ')[0];
          });

          each(this.dataSourceBySelectedDate.data, postalCode => {
            this.dataSourceByPostalCode.data.push({
              groupBy: postalCode.postalCode,
              signs: [],
            });
          });
          each(signsGrouped, (signs, key) => {
            each(this.dataSourceByPostalCode.data, list => {
              if (list.groupBy == key) {
                list.signs = signs;
              }
            });
            // this.dataSourceByPostalCode.data.push({
            //   groupBy: key,
            //   signs,
            // });
          });
          console.log('STEP 2: ', this.dataSourceByPostalCode.data);
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

  scheduleDateSelected(value: string) {
    console.log('VAAALUE: ', value);
  }

  formatDate(date: string | undefined): string {
    if (!date) {
      return '';
    }

    var d = new Date(date),
      month = '' + (d!.getMonth() + 1),
      day = '' + d!.getDate(),
      year = d!.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  downloadAsPDF() {
    console.log('Preparing PDF...');
    let div = this.pdfTable.nativeElement;

    var img: any;
    var filename;
    var newImage: any;

    var fileName =
      'work_schedule_' + this.firstFormGroup.value.date?.toString() + '.pdf';

    domtoimage
      .toPng(div, { bgcolor: '#fff' })

      .then(function (dataUrl) {
        img = new Image();
        img.src = dataUrl;
        newImage = img.src;

        img.onload = function () {
          var pdfWidth = img.width;
          var pdfHeight = img.height;

          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

          var doc;

          if (pdfWidth > pdfHeight) {
            doc = new jsPDF('l', 'px', [pdfWidth, pdfHeight]);
          } else {
            doc = new jsPDF('p', 'px', [pdfWidth, pdfHeight]);
          }

          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();

          doc.addImage(newImage, 'PNG', 10, 10, width, height);
          doc.save(fileName);
        };
      })
      .catch(function (error) {
        // Error Handling
      });
  }
}
