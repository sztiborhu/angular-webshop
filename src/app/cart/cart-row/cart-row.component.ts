import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {Product} from '../../shared/model/product.model';
import {ProductService} from '../../shared/services/product.service';
import {Observable} from 'rxjs';
import {HuCurrencyPipe} from '../../shared/pipes/hu-currency.pipe';

@Component({
  selector: 'app-cart-row',
  imports: [
    MatIcon,
    MatIconButton,
    HuCurrencyPipe
  ],
  templateUrl: './cart-row.component.html',
  styleUrl: './cart-row.component.scss'
})
export class CartRowComponent {
  @Input() item!: any;
  @Output() removeFromCart = new EventEmitter<{productId: string, quantity: number, price: number}>();

  private products$: Observable<Product[]> = new Observable<Product[]>();

  product : Product | undefined = undefined;


  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.products$ = this.productService.getProducts();

    this.products$.subscribe(products => {
      for (let i = 0; i < products.length; i++) {
        if (products[i].id == this.item.productId) {
          this.product = products[i];
        }
      }
    })

  }

  removeItem() {
    this.removeFromCart.emit(this.item);
  }
}
