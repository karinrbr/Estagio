import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  GeofencingService,
  LatLng,
} from 'src/app/components/google-map/geofencing.service';
import { reduce, assign, isEmpty, pick, trim } from 'lodash-es';
import { SignService, Sign } from 'src/app/signs/sign.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToasterService,
  ToastStatus,
} from 'src/app/core/toaster/toaster.service';
import { SessionService } from 'src/app/auth/session.service';
import { Subscription } from 'rxjs';

interface SelectValue {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-sign',
  templateUrl: './create-sign.component.html',
  styleUrls: ['./create-sign.component.scss'],
})
export class CreateSignComponent implements OnInit, OnDestroy {
  @Input() usingStraySettings = false; // decorate the property with @Input()

  isLoading: boolean = false;

  signId: string | null = null;

  isEditing: boolean = false;

  reads: SelectValue[] = [
    { value: 'sale', viewValue: 'For Sale' },
    { value: 'sold', viewValue: 'Sold' },
    { value: 'to_let', viewValue: 'To Let' },
    { value: 'let_by', viewValue: 'Let By' },
  ];

  works: SelectValue[] = [
    { value: 'new', viewValue: 'new' },
    { value: 'reerect', viewValue: 'Re-Erect' },
    { value: 'change', viewValue: 'Change' },
    { value: 'collect', viewValue: 'Collect' },
  ];

  UKPostCodePattern =
    /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/;

  createSignForm = new FormGroup({
    houseNumber: new FormControl('', [
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(36),
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(58),
    ]),
    postalCode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
      // Validators.pattern(this.UKPostCodePattern),
    ]),
    readSign: new FormControl('', [Validators.required]),
    workType: new FormControl('new', []),
    notes: new FormControl('', []),
  });

  straySignForm = new FormGroup({
    houseNumber: new FormControl('', [
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    address: new FormControl('', [
      // Validators.required,
      Validators.minLength(3),
      Validators.maxLength(36),
    ]),
    city: new FormControl('', [
      // Validators.required,
      Validators.minLength(3),
      Validators.maxLength(58),
    ]),
    postalCode: new FormControl('', [
      // Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
      // Validators.pattern(this.UKPostCodePattern),
    ]),
    readSign: new FormControl('', [Validators.required]),
    workType: new FormControl(this.usingStraySettings? 'collect' : 'new', []),
    notes: new FormControl('', []),
  });

  currentSignForm = this.createSignForm

  markerLatLng?: LatLng;

  constructor(
    private readonly geofencingService: GeofencingService,
    private readonly signService: SignService,
    private readonly sessionService: SessionService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toasterService: ToasterService
  ) {}

  geoMarkerLatLngSubscription?: Subscription;
  geoMarkerAddressSubscription?: Subscription;
  fetchSignSubscription?: Subscription;
  createSignSubscription?: Subscription;
  updateSignSubscription?: Subscription;

  ngOnInit(): void {

    if(this.usingStraySettings) {
      this.currentSignForm = this.straySignForm
    }

    this.geoMarkerLatLngSubscription =
      this.geofencingService.selectedGeoMarkerLatLng$.subscribe(value => {
        console.log('actualizou marker no form: ', value);
        if (value.lat && value.lng) {
          this.markerLatLng = value;
        } else {
          this.markerLatLng = undefined;
        }
      });

    this.geoMarkerAddressSubscription =
      this.geofencingService.selectedGeoMarkerAddress$.subscribe(value => {
        console.log(
          'CreateSignComponent selectedGeoMarkerAddress.sub.next: ',
          value
        );
        this.currentSignForm.patchValue({
          address: value.street,
          city: value.city,
        });
      });

    this.getSign();
  }

  ngOnDestroy(): void {
    this.geoMarkerLatLngSubscription?.unsubscribe();
    this.geoMarkerAddressSubscription?.unsubscribe();
    this.fetchSignSubscription?.unsubscribe();
    this.createSignSubscription?.unsubscribe();
    this.updateSignSubscription?.unsubscribe();

    this.geofencingService.setGeoString('');
    this.geofencingService.setGeoMarkerAddress({
      city: '',
      street: '',
      postalCode: '',
    });
  }

  readSignValueChange(value: string) {
    this.currentSignForm.patchValue({ readSign: value });
  }

  workSignValueChange(value: string) {
    this.currentSignForm.patchValue({ workType: value });
  }

  notesValueChange(value: string) {
    this.currentSignForm.patchValue({ notes: value });
  }


  getSign(): void {
    this.signId = this.route.snapshot.paramMap.get('id');
    if (this.signId && this.signId != '') {
      this.isEditing = true;
      this.fetchSignSubscription = this.signService
        .fetchSignById(this.signId)
        .subscribe(value => {
          this.currentSignForm.patchValue({
            city: value.city,
            address: value.address,
            postalCode: value.postalCode,
            houseNumber: value.houseNumber,
            readSign: value.readSign,
            workType: value.workType,
            notes: value.notes
          });
          // this.geofencingService.setGeoString(this.generateGeoString());
          this.geofencingService.setGeoMarkerLatLng(value.markerLatLng);
          this.buttonFindGeoTag()
        });
    }
  }

  // postCodeValidator(control: FormControl) {
  //   let givenPostCode = control.value;

  //   let UKPostCodePattern =
  //     /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))s?[0-9][A-Za-z]{2}))$/;
  //   var isUKPostCodeValid = UKPostCodePattern.test(givenPostCode);

  //   console.log(
  //     'postcode validity ',
  //     isUKPostCodeValid,
  //     ' for ',
  //     givenPostCode
  //   );

  //   if (!isUKPostCodeValid) {
  //     return {
  //       postCode: {
  //         required: 'UK Valid PostCode',
  //         provided: givenPostCode,
  //       },
  //     };
  //   }
  //   return null;
  // }

  generateGeoString(): string {
    return reduce(
      pick(this.currentSignForm.value, [
        'postalCode',
        // 'city',
        // 'address',
        // 'houseNumber',
      ]),
      (sum, n) => {
        return !isEmpty(n) ? `${trim(n ?? '')} ${trim(sum)}` : `${trim(sum)}`;
      },
      ''
    );
  }

  changeSelected(purgeForm: boolean = false) {
    if (purgeForm) {
      this.currentSignForm.patchValue({
        houseNumber: '',
        address: '',
        city: '',
      });
    }

    // Set GeoString to search using Geofencing API

    console.log('CALLED changeSelected GEOSTRING');
    // this.geofencingService.setGeoString(this.generateGeoString());
  }

  buttonFindGeoTag() {
    this.geofencingService.setGeoString(this.generateGeoString());
  }

  // Handle submit/create button
  handleCreate() {
    this.currentSignForm.markAllAsTouched();
    if (this.currentSignForm.valid) {
      this.isLoading = true;
      let newSign: Sign = {
        houseNumber: trim(this.currentSignForm.value.houseNumber ?? ''),
        address: trim(this.currentSignForm.value.address ?? ''),
        city: trim(this.currentSignForm.value.city ?? ''),
        postalCode: trim(this.currentSignForm.value.postalCode ?? ''),
        readSign: this.currentSignForm.value.readSign ?? '',
        markerLatLng: this.markerLatLng ?? {},
        workType: this.currentSignForm.value.workType ?? '',
        notes: this.currentSignForm.value.notes ?? ''
      };
      console.log("FUCIKING NEW SIGN", newSign)

      let handleError = (error: Error) => {
        this.isLoading = false;
        this.toasterService.toast(ToastStatus.error, 'Try again later.');
        console.error('Error!: ', error);
      };

      if (this.isEditing) {
        this.updateSignSubscription = this.signService
          .updateSign(assign(newSign, { id: this.signId }))
          .subscribe({
            next: sign => {
              this.isLoading = false;
              console.log('Created! SIGN: ', sign);
              this.toasterService.toast(ToastStatus.success, 'Edit sucessful');
              this.router.navigate(['agent', 'signs']);
            },
            error: error => handleError(error),
          });
      } else {
        let userLogged = this.sessionService.getUser();
        this.createSignSubscription = this.signService
          .createSign(assign({}, newSign, { createdBy: userLogged.id }))
          .subscribe({
            next: sign => {
              this.isLoading = false;
              console.log('Created! SIGN: ', sign);
              this.toasterService.toast(
                ToastStatus.success,
                'Created sucessful'
              );
              this.router.navigate(['agent', 'signs']);
            },
            error: error => handleError(error),
          });
      }
    }
  }
}
