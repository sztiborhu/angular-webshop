import {Component, inject} from '@angular/core';
import {CardComponent} from '../shared/card/card.component';
import {ProductService} from '../shared/services/product.service';
import {filter, Observable, of} from 'rxjs';
import {Product} from '../shared/model/product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MatProgressBar} from '@angular/material/progress-bar';
import {AsyncPipe} from '@angular/common';
import {Auth, authState} from '@angular/fire/auth';
import {UserService} from '../shared/services/user.service';
import {switchMap} from 'rxjs/operators';
import {CartService} from '../shared/services/cart.service';

@Component({
  selector: 'app-products',
  imports: [
    CardComponent,
    MatProgressBar,
    AsyncPipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private auth = inject(Auth);
  private _snackBar = inject(MatSnackBar);

  products$: Observable<Product[]>;
  pageTitle: string = 'Termékek';
  selectedCategory: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService) {
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


    this.selectedCategory = this.route.snapshot.paramMap.get('category') || '';
    this.pageTitle = this.selectedCategory || 'Termékek';

    this.products$ = this.selectedCategory
      ? this.productService.getProductsByCategory(this.selectedCategory)
      : this.productService.getProducts();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.selectedCategory = this.route.snapshot.paramMap.get('category') || '';
      this.pageTitle = this.selectedCategory || 'Termékek';

      this.products$ = this.selectedCategory
        ? this.productService.getProductsByCategory(this.selectedCategory)
        : this.productService.getProducts();
    });
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
}
