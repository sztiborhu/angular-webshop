import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { HuCurrencyPipe } from '../../shared/pipes/hu-currency.pipe';
import {MatButton} from '@angular/material/button';
import {ProductService} from '../../shared/services/product.service';
import {Auth} from '@angular/fire/auth';

export interface ListItem {
  productName: string;
  quantity: string;
  price: number;
}

@Component({
  selector: 'app-profile-order-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, DatePipe, HuCurrencyPipe, MatButton],
  templateUrl: './profile-order-dialog.component.html',
  styleUrl: './profile-order-dialog.component.scss'
})

export class ProfileOrderDialogComponent {
  private auth = inject(Auth);

  protected data = inject(MAT_DIALOG_DATA);
  protected dialogRef = inject(MatDialogRef<ProfileOrderDialogComponent>);

  listItems: ListItem[] = [];

  constructor(private productService: ProductService) {
    const items = this.data.items;

    for (const item of items) {
      this.productService.getProductById(item.productId).subscribe(product => {
        this.listItems.push({
          productName: product.name,
          quantity: item.quantity,
          price: item.price
        });
      });
    }

  }

  onClose() { this.dialogRef.close(); }
}
