import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToasterService } from 'src/app/core/toaster/toaster.service';
import { MatStepper } from '@angular/material/stepper';
import { pluck } from 'rxjs';
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";
import { each } from 'lodash-es';

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

interface SelectValue {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-invoice-generate-admin',
  templateUrl: './invoice-generate-admin.component.html',
  styleUrls: ['./invoice-generate-admin.component.scss']
})
export class InvoiceGenerateAdminComponent implements OnInit, AfterViewInit {
  firstFormGroup = this._formBuilder.group({
    selectedRecipient: ['', Validators.required],
    firstCtrl: ['', Validators.required],
    worker: new FormControl('c88ac485-f823-4418-b1dd-e0e66a9af631', [
      Validators.required,
    ]),
    date: new FormControl('', [Validators.required]),
  });

  secondFormGroup = this._formBuilder.group({
    name: ['Westcoast Properties', Validators.required],
    address: ['5 Comiston Way', Validators.required],
    phone: ['(+355) 069 22 22 222', Validators.required],
    email: ['client@website.test', Validators.required],
    otherInfo: ['www.website.al', Validators.required]

  });
  isLinear = true

  USER_DATA = [
    {id: Date.now(), "description": "Board Erects", "price": 17, "quantity": 4 },
  ]

  COLUMNS_SCHEMA = [
    {
        key: "description",
        type: "text",
        label: "Description"
    },
    {
        key: "price",
        type: "number",
        label: "Price"
    },
    {
      key: "quantity",
      type: "number",
      label: "Quantity"
  },
    {
      key: "isEdit",
      type: "isEdit",
      label: ""
    }
  ]

  displayedColumns: string[] = this.COLUMNS_SCHEMA.map(col => col.key);
  dataSource = this.USER_DATA;
  columnsSchema: any = this.COLUMNS_SCHEMA;

  addRow() {
    const newRow = {id: Date.now(), "description": "", "price": 0, "quantity": 0, isEdit: true}
    this.dataSource = [...this.dataSource, newRow];
  }

  removeRow(id: number) {
    this.dataSource = this.dataSource.filter((u) => u.id !== id);
  }


  @ViewChild('stepper', { static: false }) private stepper!: MatStepper;
  selectedStreamList = [0, 1, 2];

  userSelectValues: SelectValue[] = [
    {
      value: 'c88ac485-f823-4418-b1dd-e0e66a9af631',
      viewValue: 'Company Test',
    },
  ];

  selectedRecipient: string = "";
  recipients: string[] = ['Agent on system', 'Branch on system', 'Client'];

  clients: SelectValue[] = [
    {
      value: 'c88ac485-f823-4418-b1dd-e0e66a9af745',
      viewValue: 'Agent: Agent Test',
    },
    {
      value: 'c88ac485-f823-4418-b1dd-e0e66a9af781',
      viewValue: 'Agent: Agent Test 2',
    },
  ];

  invoiceContact = {
    label: "Invoice issued for:",
    name: "",
    address: "",
    phone: "",
    email: "",
    otherInfo: "",
  }


  invoiceData: any = {
    outputType: OutputType.Save,
    returnJsPDFDocObject: true,
    fileName: "Invoice 2022",
    orientationLandscape: false,
    compress: true,
    logo: {
      src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
      width: 53.33, //aspect ratio = width/height
      height: 26.66,
      margin: {
        top: 0, //negative or positive num, from the current position
        left: 0 //negative or positive num, from the current position
      }
    },
    stamp: {
      inAllPages: true,
      src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
      width: 20, //aspect ratio = width/height
      height: 20,
      margin: {
        top: 0, //negative or positive num, from the current position
        left: 0 //negative or positive num, from the current position
      }
    },
    business: {
      name: "Sign Right",
      address: "13 Rodney Crescent",
      phone: "(+355) 069 11 11 111",
      email: "email@example.com",
      email_1: "info@example.al",
      website: "www.example.al",
    },
    // contact: {
    //   label: "Invoice issued for:",
    //   name: "Westcoast Properties",
    //   address: "5 Comiston Way",
    //   phone: "(+355) 069 22 22 222",
    //   email: "client@website.al",
    //   otherInfo: "www.website.al",
    // },
    invoice: {
      label: "Invoice #: ",
      num: 19,
      invDate: `Payment Date: ${addDays(new Date(), 15).toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      invGenDate: `Invoice Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      headerBorder: true,
      tableBodyBorder: true,
      header: [
        {
          title: "#",
          style: {
            width: 10
          }
        },
        // {
        //   title: "Title",
        //   style: {
        //     width: 30
        //   }
        // },
        {
          title: "Description",
          style: {
            width: 80
          }
        },
        { title: "Price" },
        { title: "Quantity" },
        { title: "Unit" },
        { title: "Total" }
      ],
      table: [
        // [1, "Board Erects", "17", "4.25", "£", "£72.25"],
        // [2, "Board Erects / Changes / Collections", "42", "4.25", "£", "£178.50"],
        // [2, "Board Erects / Changes / Collections", "42", "4.25", "£", "£178.50"],
      ],
      // Array.from(Array(15), (item, index) => ([
      //   index + 1,
      //   "There are many variations ",
      //   "Lorem Ipsum is simply dummy text dummy text ",
      //   200.5,
      //   4.5,
      //   "m2",
      //   400.5
      // ])),
      additionalRows: [
        // {
        //   col1: 'SubTotal:',
        //   col2: '',
        //   col3: '£250.75',
        //   style: {
        //     fontSize: 10 //optional, default 12
        //   }
        // },
        // {
        //   col1: 'VAT:',
        //   col2: '%',
        //   col3: '0',
        //   style: {
        //     fontSize: 10 //optional, default 12
        //   }
        // },
        // {
        //   col1: 'Total:',
        //   col2: '',
        //   col3: '£250.75',
        //   style: {
        //     fontSize: 14 //optional, default 12
        //   }
        // }
      ],

      invDescLabel: "Invoice Note",
      invDesc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
    },
    footer: {
      text: "The invoice is created on a computer and is valid without the signature and stamp.",
    },
    pageEnable: true,
    pageLabel: "Page ",
  }

  constructor(
    private toasterService: ToasterService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.stepper.selectionChange
      .pipe(pluck('selectedIndex'))
      .subscribe((res: number) => {
        console.log('STEP: ', res);

        if (res === 0) {
          // Invoice Recipient Select
          console.log("Recipient SELECT")
        }

        if (res === 1) {
          // Invoice Recipient Details
          console.log("Recipient DETAILS")
          console.log('STEP 1: ', res);
        }

        if (res === 2) {
          // Invoice Details
          console.log("Invoice DETAILS")
          console.log('STEP 2: ', res);
        }
      });
  }

  prepareInvoiceLines() {
// [1, "Board Erects", "17", "4.25", "£", "£72.25"],
    // [2, "Board Erects / Changes / Collections", "42", "4.25", "£", "£178.50"],
    // [2, "Board Erects / Changes / Collections", "42", "4.25", "£", "£178.50"],

    var lines: (string | number)[][] = []
    var totalPrice = 0
    each(this.dataSource, line => {
      let calcPrice = line.quantity * line.price
      totalPrice += calcPrice
      lines.push(
        [lines.length + 1, line.description, line.quantity, line.price, "£", `£${calcPrice}`]
      )
    })
    this.invoiceData.invoice.table = lines

    this.invoiceData.invoice.additionalRows = [
      {
        col1: 'SubTotal:',
        col2: '',
        col3: `£${totalPrice}`,
        style: {
          fontSize: 10 //optional, default 12
        }
      },
      {
        col1: 'VAT:',
        col2: '%',
        col3: '0',
        style: {
          fontSize: 10 //optional, default 12
        }
      },
      {
        col1: 'Total:',
        col2: '',
        col3: `£${totalPrice}`,
        style: {
          fontSize: 14 //optional, default 12
        }
      }
    ]
  
  }

  generateInvoice() {
    let data = { ...this.invoiceData }

    this.invoiceContact.name = this.secondFormGroup.value.name?.toString() ?? "";
    this.invoiceContact.address = this.secondFormGroup.value.address?.toString() ?? "";
    this.invoiceContact.phone = this.secondFormGroup.value.phone?.toString() ?? "";
    this.invoiceContact.email = this.secondFormGroup.value.email?.toString() ?? "";
    this.invoiceContact.otherInfo = this.secondFormGroup.value.otherInfo?.toString() ?? "";

    data.contact = this.invoiceContact

    this.prepareInvoiceLines()

    const pdfCreated = jsPDFInvoiceTemplate({ ...data });
    var blob = pdfCreated.blob;
    var pagesNum = pdfCreated.pagesNumber;
    var pdfObject = pdfCreated.jsPDFDocObject;
    const url = window.URL.createObjectURL(blob!);
    window.open(url);
  }
}
