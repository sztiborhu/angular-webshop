import {Component, inject} from '@angular/core';
import {CartRowComponent} from './cart-row/cart-row.component';
import {Observable, map, of} from 'rxjs';
import {CartService} from '../shared/services/cart.service';
import {MatIcon} from '@angular/material/icon';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import {MatFabButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Auth, authState, user, User} from '@angular/fire/auth';
import {CartItem} from '../shared/model/cartitem.model';
import {AsyncPipe} from '@angular/common';
import {ProductService} from '../shared/services/product.service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  imports: [
    CartRowComponent,
    MatIcon,
    HuCurrencyPipe,
    MatFabButton,
    AsyncPipe,
    MatProgressBar
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private _snackBar = inject(MatSnackBar);
  private auth = inject(Auth);

  cartItems$: Observable<CartItem[]> = new Observable<CartItem[]>();
  totalPrice$: Observable<number> = new Observable<number>();

  user: User | null = null;

  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private userService: UserService,
    private router: Router) {
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return this.userService.isAdmin(user.uid);
        }
        return of(false);
      })
    ).subscribe(isAdmin => {
      if (isAdmin) {
        this.router.navigateByUrl("/admin");
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;

    this.user = this.auth.currentUser;
    if (!this.user) {
      throw new Error('User must be logged in to view cart');
    }

    this.cartItems$ = this.cartService.getCartItems(this.user.uid);
    this.totalPrice$ = this.cartService.getCartTotal(this.user.uid);
    this.cartItems$.subscribe(cartItems => {
     this.isLoading = false;
    });
  }

  handleRemove(item: CartItem) {
    const user = this.auth.currentUser;
    if (user) {
      this.cartService.removeFromCart(user.uid, item.productId);
    }
  }

  handleCheckout() {
    this.router.navigate(['/checkout']);
  }

  handleClear() {
    if (this.user) {
      this.cartService.clearCart(this.user.uid);
    }
  }

  decreaseQuantity(cartItem: CartItem) {
    if (this.user) {
      this.productService.getProductById(cartItem.productId).subscribe(product => {
        this.cartService.updateQuantity(this.user!.uid, product, -1).then(() => {
          this._snackBar.open(product.name + ' mennyisége csökkentve.', 'Bezár', {
            duration: 3000,
          });
        });
      });
    }

  }

  increaseQuantity(cartItem: CartItem) {
    if (this.user) {
      this.productService.getProductById(cartItem.productId).subscribe(product => {
        this.cartService.updateQuantity(this.user!.uid, product, 1).then(() => {
          this._snackBar.open(product.name + ' mennyisége növelve.', 'Bezár', {
            duration: 3000,
          });
        });
      });
    }
  }
}
