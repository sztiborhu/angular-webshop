import {Component, inject} from '@angular/core';
import {CardComponent} from '../shared/card/card.component';
import {ProductService} from '../shared/services/product.service';
import {Observable, of} from 'rxjs';
import {Product} from '../shared/model/product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatProgressBar} from '@angular/material/progress-bar';
import {AsyncPipe} from '@angular/common';
import {CartService} from '../shared/services/cart.service';
import {Auth, authState} from '@angular/fire/auth';
import {UserService} from '../shared/services/user.service';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [
    CardComponent,
    MatButton,
    MatProgressBar,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private _snackBar = inject(MatSnackBar);
  private auth = inject(Auth);

  products$: Observable<Product[]> = new Observable<Product[]>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
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

    this.products$ = this.productService.getProducts();
  }

  handleFavorite(product: Product) {
    this._snackBar.open(product.name + ' hozzáadva a kedvencekhez.', 'Bezár', {
      duration: 3000,
    });
  }

  handleOnAddToCart(product: Product) {
    const user = this.auth.currentUser;
    if (!user) {
      this._snackBar.open('Kérlek jelentkezz be a kosár használatához.', 'Bezár', {
        duration: 3000,
      });
      return;
    }

    this.cartService.updateQuantity(user.uid, product).catch(error => {
      this._snackBar.open('Hiba történt a kosárhoz adás során.', 'Bezár', {
        duration: 3000,
      });
    });


  }

  goToProducts() {
    this.router.navigateByUrl("/products");
  }
}
