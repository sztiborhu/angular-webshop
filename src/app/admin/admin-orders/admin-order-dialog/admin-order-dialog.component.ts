import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Order } from '../../../shared/model/order.model';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/model/product.model';
import { HuCurrencyPipe } from '../../../shared/pipes/hu-currency.pipe';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressBar} from '@angular/material/progress-bar';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface ListCartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

@Component({
  selector: 'app-admin-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    HuCurrencyPipe,
    DatePipe,
    MatProgressBar
  ],
  templateUrl: './admin-order-dialog.component.html',
  styleUrl: './admin-order-dialog.component.scss'
})
export class AdminOrderDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AdminOrderDialogComponent>);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private _snackBar = inject(MatSnackBar);
  protected data = inject(MAT_DIALOG_DATA);

  orderForm: FormGroup;
  items: OrderItem[] = [];
  listItems: ListCartItem[] = [];
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total'];
  isLoading = false;

  constructor() {
    this.orderForm = this.fb.group({
      status: [this.data.status, [Validators.required]]
    });

    this.loadOrderItems();
  }

  private loadOrderItems() {
    this.items = [...this.data.items];

    for (const item of this.items) {
      this.productService.getProductById(item.productId).subscribe({
        next: (product) => {
          const listItem: ListCartItem = {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: product.name
          };
          this.listItems = [...this.listItems, listItem];
        },
        error: (error) => {
          const listItem: ListCartItem = {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: 'Ismeretlen termék'
          };
          this.listItems = [...this.listItems, listItem];
          this._snackBar.open('Hiba történt a termék betöltése során!', 'Bezár', {
            duration: 3000,
          })
        }

      });
    }
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const updatedOrder: Partial<Order> = {
        status: this.orderForm.value.status
      };

      this.orderService.updateOrder(this.data.id, updatedOrder)
        .then(() => {
          this._snackBar.open('Rendelés sikeresen frissítve!', 'Bezár', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        })
        .catch(error => {
          console.error('Error updating order:', error);
          this._snackBar.open('Hiba történt a rendelés frissítése során!', 'Bezár', {
            duration: 3000,
          });
        });
    }
  }

  onDelete(): void {
    if (confirm('Biztosan törölni szeretnéd ezt a rendelést?')) {
      this.orderService.deleteOrder(this.data.id)
        .then(() => {
          this._snackBar.open('Rendelés sikeresen törölve!', 'Bezár', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        })
        .catch(error => {
          console.error('Error deleting order:', error);
          this._snackBar.open('Hiba történt a rendelés törlése során!', 'Bezár', {
            duration: 3000,
          });
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
