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
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../shared/services/product.service';
import {Observable} from 'rxjs';
import {Product} from '../shared/model/product.model';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import {MatChip, MatChipSet} from '@angular/material/chips';

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
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  private _snackBar = inject(MatSnackBar);

  private products$: Observable<Product[]> = new Observable<Product[]>();
  product: Product | undefined = undefined;
  productQuantity: number = 1;
  mainCategory: string = "";
  details: Record<string, string>[] = [];

  similarProducts: Product[] = [];

  amount: number = 1;

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService) {
    let found = false;

    this.products$ = this.productService.getProducts();

    let id = this.route.snapshot.paramMap.get('id');

    this.products$.subscribe(products => {
      for (const product of products) {
        if (product.id == id) {
          this.product = product;
          this.productQuantity = product.quantity;
          this.mainCategory = product.categories[0];
          this.details = product.details;
          found = true;
          console.log(this.product.details)
          break;
        }
      }

      if (!found) {
        this.router.navigateByUrl("/");
      }

      for (const product of products) {
        if (product.categories[0] == this.mainCategory && product.id != id) {
          this.similarProducts.push(product);
        }
      }
    })


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
    this._snackBar.open(product?.name + ' hozzáadva a kosárhoz.', 'Bezár', {
      duration: 3000,
    });
  }

  protected readonly HuCurrencyPipe = HuCurrencyPipe;
}
