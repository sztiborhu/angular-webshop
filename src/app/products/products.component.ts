import {Component, inject} from '@angular/core';
import {CardComponent} from '../shared/card/card.component';
import {ProductService} from '../shared/services/product.service';
import {filter, Observable} from 'rxjs';
import {Product} from '../shared/model/product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [
    CardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private _snackBar = inject(MatSnackBar);

  products$: Observable<Product[]> = new Observable<Product[]>();

  products: Product[] = [];
  pageTitle: string = 'Termékek';

  selectedCategory: string = '';

  constructor(private router : Router, private route: ActivatedRoute, private productService: ProductService) {
  }

  ngOnInit() {
    this.selectedCategory = this.route.snapshot.paramMap.get('category') || '';

    if (this.selectedCategory !== '') {
      this.pageTitle = this.selectedCategory;
    }

    this.products = [];

    this.productService.getProducts().subscribe(productsArray => {
      if (this.selectedCategory !== '') {
        for (let i = 0; i < productsArray.length; i++) {
          if (productsArray[i].categories.includes(this.selectedCategory)) {
            this.products.push(productsArray[i]);
          }
        }
      } else {
        this.products = productsArray;
      }
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(() => {
        this.ngOnInit();
      });

    if (this.products.length == 0) {
      this.pageTitle = 'Nincs találat erre a kategóriára.';
    }
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
