import {Component, inject} from '@angular/core';
import {CardComponent} from '../home/sub/card/card.component';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  private _snackBar = inject(MatSnackBar);
  amount: number = 1;



  addToAmount() {
    if (this.amount+1 <= 5) {
      this.amount += 1;
    } else {
      this._snackBar.open("Elérte a maximális rendelhető mennyiséget.", "OK", {duration: 2000});
    }
  }
  removeFromAmount() {
    if (this.amount > 1) {
      this.amount -= 1;
    }
  }

}
