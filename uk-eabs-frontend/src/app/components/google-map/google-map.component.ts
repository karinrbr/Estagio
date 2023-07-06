import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MapGeocoder, MapInfoWindow } from '@angular/google-maps';
import { each, includes, isEmpty, take } from 'lodash-es';
import { GeoAddress, GeofencingService, LatLng } from './geofencing.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit, OnDestroy {
  apiLoaded: Observable<boolean>;

  zoom: number = 6;
  center: google.maps.LatLngLiteral = {
    lat: 53.0,
    lng: -1.5,
  };

  options: google.maps.MapOptions = {
    // mapTypeId: 'street',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 4,
    tilt: 0,
    // zoom: 8,
    // center: undefined,
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
    icon: '/assets/icons/land-sales-40.png',
  };

  markerPositions: google.maps.LatLng[] = [];
  localGeoSearchString: string = '';

  apiLoadedSubscriber?: Subscription;
  geoStringSubscriber?: Subscription;
  geoMarkerLatLngSubscriber?: Subscription;

  constructor(
    private readonly geocoder: MapGeocoder,
    private readonly geofencingService: GeofencingService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.apiLoaded = this.geofencingService.isAPILoaded$;
  }
  ngOnInit(): void {
    this.apiLoadedSubscriber = this.apiLoaded.subscribe({
      next: value => {
        console.log('GoogleMapComponent isAPILoaded.sub.next: ', value);
        if (value) {
          // this.options.center = new google.maps.LatLng(51.5072, 0.1276);
          this.geoStringSubscriber =
            this.geofencingService.selectedGeoString$.subscribe(value => {
              console.log(
                `GoogleMapComponent selectedGeoString.sub.next: (${value})`
              );
              this.localGeoSearchString = value;
              this.fetchGeocoding(value);
            });

          // ONLY EXISTS TO HANDLE MARKER POSITON != FROM GEOSTRING (IT WAS MOVED)
          // this.geoMarkerLatLngSubscriber =
          //   this.geofencingService.selectedGeoMarkerLatLng$.subscribe(value => {
          //     console.log(
          //       'GoogleMapComponent selectedGeoMarkerLatLng.sub.next: ',
          //       value
          //     );
          //     this.createMarker(value);
          //   });
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.localGeoSearchString = '';
    this.markerPositions = [];
    this.apiLoadedSubscriber?.unsubscribe();
    this.geoStringSubscriber?.unsubscribe();
    this.geoMarkerLatLngSubscriber?.unsubscribe();
  }

  handleGeocodingAddress(components: google.maps.GeocoderAddressComponent[]) {
    console.warn('GoogleMapComponent: handleGeocodingAddress called');
    var currrentAddress: GeoAddress = {
      postalCode: '',
      city: '',
      street: '',
    };

    each(components, component => {
      let types = component.types;
      if (includes(types, 'postal_code')) {
        currrentAddress.postalCode = component.long_name;
      }
      if (includes(types, 'route')) {
        currrentAddress.street = component.long_name;
      }
      if (includes(types, 'postal_town')) {
        currrentAddress.city = component.long_name;
      }
    });

    this.geofencingService.setGeoMarkerAddress(currrentAddress);
  }

  fetchGeocoding(searchGeoString: string) {
    console.warn('GoogleMapComponent: fetchGeocoding called');
    if (!isEmpty(searchGeoString)) {
      this.geocoder
        .geocode({
          // address: '1600 Amphitheatre Parkway, Mountain View, CA',
          address: searchGeoString,
        })
        .subscribe(({ results }) => {
          console.log('GoogleMapComponent: fetchGeocoding results: ', results);
          // only handle 1 marker position
          each(take(results, 1), (result: google.maps.GeocoderResult) => {
            const latLng = result.geometry.location.toJSON();

            this.markerPositions = [];
            this.geofencingService.setGeoMarkerLatLng({
              lat: latLng.lat,
              lng: latLng.lng,
            });

            const address = result.address_components;
            this.handleGeocodingAddress(address);

            this.markerPositions.push(new google.maps.LatLng(latLng));

            this.center = { lat: latLng.lat, lng: latLng.lng };
            this.zoom = 13;
          });
        });
    }
  }

  createMarker(position: LatLng) {
    if (this.markerPositions.length == 0 && this.localGeoSearchString === '') {
      if (position.lat && position.lng) {
        let latLng = new google.maps.LatLng({
          lat: position.lat,
          lng: position.lng,
        });
        console.warn('GoogleMapComponent: createMarker called');
        this.markerPositions = [];
        this.markerPositions.push(latLng);
        this.center = latLng.toJSON();
        this.zoom = 13;
      }
    }
  }

  // fetchReverseGeocoding(value: google.maps.LatLngLiteral) {
  //   this.geocoder
  //     .geocode({
  //       // address: '1600 Amphitheatre Parkway, Mountain View, CA',
  //       location: value,
  //     })
  //     .subscribe(({ results }) => {
  //       console.log('reverseGeocoding: ', results);
  //       each(take(results, 1), (result: google.maps.GeocoderResult) => {
  //         const address = result.geometry.location.toJSON();
  //         console.log(address);
  //       });
  //     });
  // }

  addMarker(event: google.maps.MapMouseEvent) {
    console.warn('GoogleMapComponent: addMarker called');
    if (event != null && event.latLng != null) {
      let latLng = event.latLng.toJSON();
      this.markerPositions.push(new google.maps.LatLng(latLng));
      this.geofencingService.setGeoMarkerLatLng({
        lat: latLng.lat,
        lng: latLng.lng,
      });
    }
  }

  moveMap(event: google.maps.MapMouseEvent) {
    console.warn('GoogleMapComponent: moveMap called');
    if (event != null && event.latLng != null) {
      // this.center = event.latLng.toJSON();
      console.log('moveu gmap');
      // this.geofencingService.setGeoMarkerLatLng({
      //   lat: this.center.lat,
      //   lng: this.center.lng,
      // });
    }
  }

  move(event: google.maps.MapMouseEvent) {
    console.warn('GoogleMapComponent: move called');
    if (event != null && event.latLng != null) {
      // this.center = event.latLng.toJSON();
      // let latLng = event.latLng.toJSON();
      // this.geofencingService.setGeoMarkerLatLng({
      //   lat: latLng.lat,
      //   lng: latLng.lng,
      // });
    }
  }

  moveDragendMaker(event: google.maps.MapMouseEvent) {
    console.warn('GoogleMapComponent: moveDragendMaker called');
    if (event != null && event.latLng != null) {
      let latLng = event.latLng.toJSON();
      console.log('moved marker: ', latLng);
      this.geofencingService.setGeoMarkerLatLng({
        lat: latLng.lat,
        lng: latLng.lng,
      });
    }
  }
}
