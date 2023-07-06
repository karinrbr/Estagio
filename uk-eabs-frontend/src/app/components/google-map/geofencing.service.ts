import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

export interface GeoAddress {
  postalCode: string;
  city: string;
  street: string;
}

export interface LatLng {
  lat?: number;
  lng?: number;
}

@Injectable()
export class GeofencingService {
  private _geoString$ = new BehaviorSubject<string>('');
  selectedGeoString$ = this._geoString$.asObservable();

  private _geoMarkerLatLng$ = new BehaviorSubject<LatLng>({
    lat: undefined,
    lng: undefined,
  });
  selectedGeoMarkerLatLng$ = this._geoMarkerLatLng$.asObservable();

  private _geoMarkerAddress$ = new BehaviorSubject<GeoAddress>({
    postalCode: '',
    city: '',
    street: '',
  });
  selectedGeoMarkerAddress$ = this._geoMarkerAddress$.asObservable();

  private _apiLoaded$ = new BehaviorSubject<boolean>(false);
  isAPILoaded$ = this._apiLoaded$.asObservable();

  constructor(private readonly httpClient: HttpClient) {
    this.httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyC6DvyGXN1ZSJxGND2WgFYqpC72DCSdvBs',
        'callback'
      )
      .pipe(
        map(() => {
          console.error('DEU LOAD GOOGLE API');
          return true;
        }),
        catchError(() => of(false))
      )
      .subscribe({
        next: value => this.setIsAPILoaded(value),
        error: err => {
          console.error(err);
          this.setIsAPILoaded(false);
        },
        complete: () => {
          console.log('GeofencingService: Finished loading Google API');
        },
      });
  }

  setGeoString(value: string) {
    console.log('GeofencingService: setGeostring ', value);
    this._geoString$.next(value);
  }

  setGeoMarkerAddress(value: GeoAddress) {
    this._geoMarkerAddress$.next(value);
  }

  setGeoMarkerLatLng(value: LatLng) {
    this._geoMarkerLatLng$.next(value);
  }

  setIsAPILoaded(value: boolean) {
    // this.setGeoMarkerLatLng({ lat: undefined, lng: undefined });
    // this.setGeoMarkerAddress({
    //   postalCode: '',
    //   city: '',
    //   street: '',
    // });
    this._apiLoaded$.next(value);
  }
}
