import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUser(): { uid: any; } | PromiseLike<{ uid: any; }> {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
