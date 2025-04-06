import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardImage,
} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {HuCurrencyPipe} from '../pipes/hu-currency.pipe';
import {Product} from '../model/product.model';

@Component({
  selector: 'app-card',
  imports: [
    MatCard,
    MatCardContent,
    MatCardImage,
    MatCardActions,
    MatButton,
    MatIconButton,
    MatIcon,
    HuCurrencyPipe,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() product!: any;

  @Output() addToCart = new EventEmitter<Product>();
  @Output() favorite = new EventEmitter<Product>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  onCardClick() {
    if (this.route.snapshot.url[0].path == "product") {
      this.router.navigateByUrl("/product/" + this.product.id).then(promise => window.location.reload());
    } else {
      this.router.navigateByUrl("/product/" + this.product.id);
    }
  }

  onFavorite() {
    this.favorite.emit(this.product);
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}
