import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OrderService } from '../../shared/services/order.service';
import { Order } from '../../shared/model/order.model';
import { AdminOrderDialogComponent } from './admin-order-dialog/admin-order-dialog.component';
import { HuCurrencyPipe } from '../../shared/pipes/hu-currency.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    HuCurrencyPipe,
    DatePipe
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent {
  private _snackBar = inject(MatSnackBar);
  private orderService = inject(OrderService);
  private dialog = inject(MatDialog);

  orders: Order[] = [];
  displayedColumns: string[] = ['date', 'total_price', 'status'];
  isLoading = true;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this._snackBar.open('Hiba történt a rendelések betöltése során!', 'Bezár', {
          duration: 3000,
        });
        this.isLoading = false;
      }
    });
  }

  openOrderDialog(order: Order) {
    const dialogRef = this.dialog.open(AdminOrderDialogComponent, {
      width: '800px',
      data: order
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrders();
      }
    });
  }
}
