import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, mergeMap, flatMap, switchAll, switchMap } from 'rxjs/operators';
import { LatLng } from '../components/google-map/geofencing.service';
import { SessionService } from '../auth/session.service';
import { User } from '../core/user';
import { concat, defer } from 'rxjs';
import { assign } from 'lodash-es';

export interface Sign {
  position?: number;
  id?: string | undefined;
  houseNumber: string;
  address: string;
  city: string;
  postalCode: string;
  readSign: string;
  markerLatLng: LatLng;
  createdAt?: string | undefined | Date;
  updatedAt?: string | undefined;
  deletedAt?: string | undefined | null;
  createdBy?: string;
  status?: ScheduleStatus;
  scheduleAt?: string;
  scheduleTo?: string;
  workType?: string,
  notes?: string,
  hasNotes?: boolean
}

export enum ScheduleStatus {
  scheduled = 'scheduled',
  pending = 'pending',
  rejected = 'rejected',
}

export enum ReadSign {
  sale = 'sale',
  sold = 'sold',
  toLet = 'to_let',
  letBy = 'let_by',
}

export interface SignsDTO {
  items: Sign[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SignService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) { }

  createSign(sign: Sign) {
    return this.http
      .post<any>(`${environment.backendUrl}/v0/board`, {
        houseNumber: sign.houseNumber,
        city: sign.city,
        address: sign.address,
        postalCode: sign.postalCode,
        readSign: sign.readSign,
        markerLatLng: sign.markerLatLng,
        numBoards: 1,
        isActive: true,
        createdBy: sign.createdBy,
        notes: sign.notes,
        workType: sign.workType,
      })
      .pipe(
        map((sign: Sign) => {
          return sign;
        })
      );
  }

  scheduleSign(sign: any) {
    return this.http
      .patch<any>(`${environment.backendUrl}/v0/board/${sign.id}`, {
        scheduleAt: sign.scheduleAt,
        scheduleTo: sign.scheduleTo,
        status: sign.status,
      })
      .pipe(
        map((sign: Sign) => {
          return sign;
        })
      );
  }

  updateSign(sign: Sign) {
    return this.http
      .patch<any>(`${environment.backendUrl}/v0/board/${sign.id}`, {
        houseNumber: sign.houseNumber,
        city: sign.city,
        address: sign.address,
        postalCode: sign.postalCode,
        readSign: sign.readSign,
        markerLatLng: sign.markerLatLng,
        createdBy: sign.createdBy,
        notes: sign.notes,
        workType: sign.workType,
      })
      .pipe(
        map((sign: Sign) => {
          return sign;
        })
      );
  }

  fetchSignById(signId: string) {
    return this.http
      .get<Sign>(`${environment.backendUrl}/v0/board/${signId}`, {})
      .pipe(
        map((result: Sign) => {
          return result;
        })
      );
  }

  deleteSign(signId: string) {
    return this.http
      .delete<any>(`${environment.backendUrl}/v0/board/${signId}`)
      .pipe(
        map((sign: Sign) => {
          return sign;
        })
      );
  }

  fetchSigns(options: any = {}) {
    // {
    //   "items": [
    //     {
    //       "houseNumber": "",
    //       "city": "London",
    //       "address": "",
    //       "postalCode": "",
    //       "numBoards": 1,
    //       "isActive": true,
    //       "id": "5c17d0ee-d9e3-4abb-ab40-bda4ef51d9ae",
    //       "createdAt": "2022-08-03T19:09:19.200Z",
    //       "updatedAt": "2022-08-03T19:09:19.200Z",
    //       "deletedAt": null
    //     },
    //     {
    //       "houseNumber": "",
    //       "city": "Bristol",
    //       "address": "",
    //       "postalCode": "",
    //       "numBoards": 1,
    //       "isActive": true,
    //       "id": "e9a69898-1a15-433f-8440-928d1862e823",
    //       "createdAt": "2022-08-04T17:51:14.266Z",
    //       "updatedAt": "2022-08-04T17:51:14.266Z",
    //       "deletedAt": null
    //     }
    //   ],
    //   "meta": {
    //     "totalItems": 2,
    //     "itemCount": 2,
    //     "itemsPerPage": 10,
    //     "totalPages": 1,
    //     "currentPage": 1
    //   },
    //   "links": {
    //     "first": "/board?limit=10",
    //     "previous": "",
    //     "next": "",
    //     "last": "/board?page=1&limit=10"
    //   }
    // }

    return this.http
      .get<SignsDTO>(`${environment.backendUrl}/v0/board`, {
        params: assign({}, options, {
          page: 1,
          limit: 100,
          relations: ['createdBy', 'scheduleTo'],
        }),
      })
      .pipe(
        map((signs: SignsDTO) => {
          return signs;
        })
      );
  }

  fetchUserSigns() {
    let userLogged = this.sessionService.getUser();
    return this.http.get<SignsDTO>(`${environment.backendUrl}/v0/board`, {
      params: {
        page: 1,
        limit: 100,
        createdBy: userLogged.id ?? '',
      },
    });
  }
}
