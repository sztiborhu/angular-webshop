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
        name: 'GIGABYTE WINDFORCE GeForce RTX 4060 8GB',
        price: 129990,
        image: '1.png',
        description: 'A GIGABYTE WINDFORCE OC GeForce RTX 4060 8GB GDDR6 DLSS3 egy erőteljes és innovatív videokártya, amely a legújabb játékokat és programokat is képes hibátlanul kezelni. A hihetetlenül magas teljesítményt a letisztult, modern design kíséri, amely minden PC házba tökéletesen illeszkedik.',
        quantity: 10,
        categories: ['Videókártya', 'NVIDIA', 'Középkategória', 'GDDR6'],
        details: [{
            "name": "Memória",
            "value": "8 GB GDDR6"
         },
         {
            "name": "Min. tápegység",
            "value": "450W"
          },
          {
            "name": "Tápellátás",
            "value": "1x8 tűs"
          },
          {
            "name": "Hossz",
            "value": "192 mm"
          },
          {
            "name": "Csatlakozók",
            "value": "HDMI, DisplayPort"
        }]
      },
      {
        id: "2",
        name: 'ASUS TUF Gaming OC GeForce RTX 5070 12GB',
        price: 379990,
        image: '2.png',
        description: 'Az ASUS TUF Gaming GeForce RTX™ 5070 az NVIDIA Blackwell architektúrára épül, amelyet továbbfejlesztett hűtés és megerősített tápellátás emel új szintre. A masszív kialakítás és a strapabíró megerősítések kivételes tartósságot biztosítanak.',
        quantity: 10,
        categories: ['Videókártya', 'NVIDIA', 'Felsőkategória', 'GDDR7'],
        details: [{
          "name": "Memória",
          "value": "12 GB GDDR7"
        },
          {
            "name": "Min. tápegység",
            "value": "750W"
          },
          {
            "name": "Tápellátás",
            "value": "1x16 12VHPWR tűs"
          },
          {
            "name": "Hossz",
            "value": "329 mm"
          },
          {
            "name": "Csatlakozók",
            "value": "HDMI, DisplayPort"
          }]
      },
      {
        id: "3",
        name: 'SAPPHIRE Radeon RX 7800 XT 16GB',
        price: 221990,
        image: '3.png',
        description: 'AMD RadeOn RX 7800 XT chipsettel, 16GB GDDR6 memóriával, 2 darab HDMI kimenettel, 2 darab DisplayPort kimenettel.',
        quantity: 10,
        categories: ['Videókártya', 'AMD', 'Felsőkategória', 'GDDR6'],
        details: [{
          "name": "Memória",
          "value": "16 GB GDDR6"
        },
          {
            "name": "Min. tápegység",
            "value": "700W"
          },
          {
            "name": "Tápellátás",
            "value": "2x8 tűs"
          },
          {
            "name": "Hossz",
            "value": "280 mm"
          },
          {
            "name": "Csatlakozók",
            "value": "HDMI, DisplayPort"
          },
        ]
      },
      {
        id: "4",
        name: 'AMD Ryzen 7 9800X3D 4.70GHz AM5 BOX',
        price: 224989,
        image: '4.png',
        description: 'AMD Ryzen 7 9800X3D 4.70GHz AM5 dobozos GAMER processzor hűtő ventilátor nélkül.',
        quantity: 10,
        categories: ['Processzor', 'AMD', 'Felsőkategória', 'AM5'],
        details: [{
          "name": "CPU Család",
          "value": "AMD Ryzen 7"
        },
          {
            "name": "Gyári hűtő",
            "value": "Nincs"
          },
          {
            "name": "Foglalat",
            "value": "Socket AM5"
          },
          {
            "name": "Magok száma",
            "value": "8 db"
          },
          {
            "name": "Szálak száma",
            "value": "16 db"
          },
          {
            "name": "Órajel",
            "value": "4.7 GHz"
          },
          {
            "name": "TDP",
            "value": "120W"
          }]
      },
      {
        id: "5",
        name: 'INTEL Core i7-14700K 3.40GHz LGA-1700 BOX',
        price: 144990,
        image: '5.png',
        description: 'INTEL Core i7-14700K 3.40GHz LGA-1700 foglalatú dobozos processzor hűtő ventilátor nélkül.',
        quantity: 10,
        categories: ['Processzor', 'Intel', 'Felsőkategória', 'LGA-1700'],
        details: [{
          "name": "CPU Család",
          "value": "Intel Core i7"
        },
          {
            "name": "Gyári hűtő",
            "value": "Nincs"
          },
          {
            "name": "Foglalat",
            "value": "LGA-1700"
          },
          {
            "name": "Magok száma",
            "value": "8 db"
          },
          {
            "name": "Szálak száma",
            "value": "28 db"
          },
          {
            "name": "Órajel",
            "value": "3.4 GHz"
          },
          {
            "name": "TDP",
            "value": "253W"
          }]
      },
      {
        id: "6",
        name: ' LOGITECH G Pro Wireless fekete',
        price: 46590,
        image: '6.png',
        description: 'A PRO játékhoz tervezett vezeték nélküli egér azért jött létre, hogy egyértelmű választás legyen a profi e-sportolók számára.',
        quantity: 10,
        categories: ['Periféria', 'Egér', 'Logitech', 'Vezeték nélküli'],
        details: [{
          "name": "Szín",
          "value": "Fekete"
        },
          {
            "name": "Érzékelő",
            "value": "Optikai"
          },
          {
            "name": "Vezeték nélküli",
            "value": "Igen"
          },
          {
            "name": "USB",
            "value": "Igen"
          }]
      }
    ]);
  }
}
