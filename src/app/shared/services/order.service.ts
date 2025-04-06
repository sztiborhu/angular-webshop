import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Order} from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() {
  }

  getOrders(): Observable<Order[]> {
    return of(
      [{
        id: "1",
        card: true,
        user_email: "teszt@gmail.com",
        price: 10000,
        address: "Budapest, Fő utca 1.",
        date: 1680000000000,
        status: "pending",
        items: [{
          productId: "1",
          quantity: 1,
          price: 10000
        },
          {
            productId: "2",
            quantity: 1,
            price: 10000
          }]
      },
      {
        id: "2",
        card: true,
        user_email: "teszt@gmail.com",
        price: 10000,
        address: "Budapest, Fő utca 1.",
        date: 1680000000000,
        status: "pending",
        items: [{
          productId: "1",
          quantity: 1,
          price: 10000
        }]
      }]
    )
  }

}
