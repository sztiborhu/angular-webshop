import {Component, inject} from '@angular/core';
import {CardComponent} from '../shared/card/card.component';
import {ProductService} from '../shared/services/product.service';
import {Observable} from 'rxjs';
import {Product} from '../shared/model/product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HoverHighlightDirective} from '../shared/directive/hover-highlight.directive';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    CardComponent,
    MatButton,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private _snackBar = inject(MatSnackBar);

  constructor(private productService: ProductService) {
  }

  products$: Observable<Product[]> = new Observable<Product[]>();
  products: Product[] = [];

  ngOnInit() {
    this.productService.getProducts().subscribe(productsArray => {
      this.products = productsArray;
    })
  }

  handleFavorite(product: Product) {
    this._snackBar.open(product.name + ' hozzáadva a kedvencekhez.', 'Bezár', {
      duration: 3000,
    });
  }

  handleOnAddToCart(product: Product) {
    this._snackBar.open(product.name + ' hozzáadva a kosárhoz.', 'Bezár', {
      duration: 3000,
    });
  }
}
