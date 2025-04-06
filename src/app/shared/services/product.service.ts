import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Product} from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // TODO: Firebase, ezek csak placeholderek
  getProducts(): Observable<Product[]> {
    return of([
      {
        id: "1",
        name: 'Product 1',
        price: 100000,
        image: '1.png',
        description: 'Ez egy nagyon jó videokártya, amely kiváló teljesítményt nyújt a legújabb játékokhoz.',
        quantity: 10,
        categories: ['Videókártya', 'AMD', 'asd'],
        details: [{
          "name": "Memória",
          "value": "10 GB GDDR6X"
         },
         {
          "name": "Órajel",
          "value": "1440 MHz"
          },
          {
          "name": "TDP",
          "value": "320 W"
          },
          {
          "name": "Csatlakozók",
          "value": "HDMI, DisplayPort"
        }]
      },
      {
        id: "2",
        name: 'Product 2',
        price: 200000,
        image: '1.png',
        description: 'Description of Product 2',
        quantity: 10,
        categories: ['Videókártya', 'AMD'],
        details: [{
          "name": "Memória",
          "value": "10 GB GDDR6X"
          },
          {
            "name": "Órajel",
            "value": "1440 MHz"
          },
          {
            "name": "TDP",
            "value": "320 W"
          },
          {
            "name": "Csatlakozók",
            "value": "HDMI, DisplayPort"
          }]
      },
      {
        id: "3",
        name: 'Product 3',
        price: 300000,
        image: '1.png',
        description: 'Description of Product 3',
        quantity: 10,
        categories: ['Videókártya', 'AMD', 'aaa'],
        details: [{
          "name": "Memória",
          "value": "10 GB GDDR6X"
          },
          {
            "name": "Órajel",
            "value": "1440 MHz"
          },
          {
            "name": "TDP",
            "value": "320 W"
          },
          {
            "name": "Csatlakozók",
            "value": "HDMI, DisplayPort"
          }]
      }
    ]);
  }
}
