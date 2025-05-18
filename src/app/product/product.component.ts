import {Component, inject} from '@angular/core';
import {CardComponent} from '../shared/card/card.component';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {ProductService} from '../shared/services/product.service';
import {filter, Observable, of} from 'rxjs';
import {Product} from '../shared/model/product.model';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatProgressBar} from '@angular/material/progress-bar';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../shared/services/user.service';
import {Auth, authState} from '@angular/fire/auth';
import {switchMap} from 'rxjs/operators';
import {CartService} from '../shared/services/cart.service';
import {KeyOfPipe} from '../shared/pipes/key-of.pipe';
import {ValueOfPipe} from '../shared/pipes/value-of.pipe';

@Component({
  selector: 'app-product',
  imports: [
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardImage,
    MatFabButton,
    MatIcon,
    HuCurrencyPipe,
    MatChipSet,
    MatChip,
    CardComponent,
    RouterLink,
    MatProgressBar,
    AsyncPipe,
    KeyOfPipe,
    ValueOfPipe,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  private auth = inject(Auth);
  private _snackBar = inject(MatSnackBar);

  product: Product | undefined = undefined;
  productQuantity: number = 1;
  mainCategory: string = "";
  details: Record<string, string>[] = [];

  similarProducts$: Observable<Product[]> = new Observable<Product[]>();

  amount: number = 1;

  isLoading: boolean = false;

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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ngOnInit();
    });
  }



  ngOnInit() {
    this.isLoading = true;

    let id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigateByUrl("/");
      return;
    }

    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.product = product;
        this.productQuantity = product.quantity;
        this.mainCategory = product.categories[0];
        this.details = product.details;

        if (product.categories.length >= 1) {
          this.similarProducts$ = this.productService.getProductsByCategory(this.mainCategory);
        }
        this.isLoading = false;

      } else {
        this.router.navigateByUrl("/");
      }
    });


  }

  ngOnChanges() {
  }


  addToAmount() {
    if (this.amount < this.productQuantity) {
      this.amount += 1;
    } else {
      this._snackBar.open("Elérte a maximális rendelhető mennyiséget.", "OK", {duration: 5000});
    }
  }
  removeFromAmount() {
    if (this.amount > 1) {
      this.amount -= 1;
    }
  }

  handleFavorite(product: Product) {
    this._snackBar.open(product.name + ' hozzáadva a kedvencekhez.', 'Bezár', {
      duration: 3000,
    });
  }

  handleOnAddToCart(product: Product | undefined) {
    const user = this.auth.currentUser;
    if (!user) {
      this._snackBar.open('Kérlek jelentkezz be a kosár használatához.', 'Bezár', {
        duration: 3000,
      });
      return;
    }

    this.cartService.updateQuantity(user.uid, product!, this.amount).catch(error => {
      this._snackBar.open('Hiba történt a kosárhoz adás során.', 'Bezár', {
        duration: 3000,
      });
    });
  }

  protected readonly HuCurrencyPipe = HuCurrencyPipe;
}
