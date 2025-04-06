import {Component, Input} from '@angular/core';
import {ProductService} from '../../../shared/services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @Input() items: any[] = [];
  filteredItems: any[] = [];

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(productArray => {
      for (let i = 0; i < productArray.length; i++) {
        for (let j = 0; j < this.items.length; j++) {
          if (productArray[i].id === this.items[j].productId) {
            this.filteredItems.push(productArray[i]);
          }
        }
      }
    });
  }

  generateText() {
    let text = '';
    for (let i = 0; i < this.filteredItems.length; i++) {
      if (i === this.filteredItems.length - 1) {
        text += this.filteredItems[i].name;
      } else {
        text += this.filteredItems[i].name + ', ';
      }
    }
    return text;
  }
}
