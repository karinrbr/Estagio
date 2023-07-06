import { Double } from 'typeorm';

export enum ScheduleStatus {
  scheduled = 'scheduled',
  pending = 'pending',
  rejected = 'rejected',
}

export enum WorkSign {
  new = 'new',
  reerect = 'reerect',
  change = 'change',
  collect = 'collect',
}

export enum ReadSign {
  sale = 'sale',
  sold = 'sold',
  toLet = 'to_let',
  letBy = 'let_by',
}

export interface LatLng {
  lat: Double;
  lng: Double;
}

// { value: 'sale', viewValue: 'For Sale' },
//     { value: 'sold', viewValue: 'Sold' },
//     { value: 'to_let', viewValue: 'To Let' },
//     { value: 'let_by', viewValue: 'Let By' },
