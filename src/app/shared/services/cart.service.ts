import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Cart} from '../model/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  // TODO: Firebase, ezek csak placeholderek
  getCart(): Observable<Cart> {
    return of({
      id: "1",
      user_email: "teszt@gmail.com",
      items: [{
        productId: "1",
        quantity: 1,
        price: 129990
      },
        {
          productId: "2",
          quantity: 3,
          price: 1139970
        }],
      totalPrice: 1269960
    });
  }
}
