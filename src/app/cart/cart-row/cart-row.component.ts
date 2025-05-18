import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {Product} from '../../shared/model/product.model';
import {ProductService} from '../../shared/services/product.service';
import {Observable} from 'rxjs';
import {HuCurrencyPipe} from '../../shared/pipes/hu-currency.pipe';
import {CartItem} from '../../shared/model/cartitem.model';

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
  @Output() removeFromCart = new EventEmitter<CartItem>();
  @Output() decrease = new EventEmitter<CartItem>();
  @Output() increase = new EventEmitter<CartItem>();

  private products$: Observable<Product[]> = new Observable<Product[]>();

  product : Product | undefined = undefined;


  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.productService.getProductById(this.item.productId).subscribe(product => {
      this.product = product;
    });



    /*
    this.products$ = this.productService.getProducts();

    this.products$.subscribe(products => {
      for (let i = 0; i < products.length; i++) {
        if (products[i].id == this.item.productId) {
          this.product = products[i];
        }
      }
    })*/

  }

  removeItem() {
    this.removeFromCart.emit(this.item);
  }

  decreaseQuantity() {
    this.decrease.emit(this.item);
  }

  increaseQuantity() {
    this.increase.emit(this.item);
  }
}
