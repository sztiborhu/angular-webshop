import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUser(): Observable<User> {
    return of({
      id: "1",
      name: 'John Doe',
      email: "john@teszt.hu",
      role: 'user'
    });
  }
}
