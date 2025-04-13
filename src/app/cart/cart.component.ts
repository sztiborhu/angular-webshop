import {Component, inject} from '@angular/core';
import {CartRowComponent} from './cart-row/cart-row.component';
import {Observable} from 'rxjs';
import {Cart} from '../shared/model/cart.model';
import {CartService} from '../shared/services/cart.service';
import {MatIcon} from '@angular/material/icon';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import {MatFabButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface Item {
  productId: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-cart',
  imports: [
    CartRowComponent,
    MatIcon,
    HuCurrencyPipe,
    MatFabButton

  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private _snackBar = inject(MatSnackBar);


  private cart$: Observable<Cart> = new Observable<Cart>();
  items: Item[] = [];

  totalPrice: number = 0;


  constructor(private cartService: CartService) {

    this.cart$ = this.cartService.getCart();


    this.cart$.subscribe(cart => {
      this.items = cart.items;
    });

  }

  ngOnInit() {
    for (let item of this.items) {
      this.totalPrice += item.price * item.quantity;
    }
  }

  handleRemove(item: Item) {

    this.items = this.items.filter(i => i.productId !== item.productId);
  }

  handleCheckout() {
    this._snackBar.open('Hamarosan lehet fizetni.', 'Bezár', {
      duration: 3000,
    });
  }

  handleClear() {

  }
}
