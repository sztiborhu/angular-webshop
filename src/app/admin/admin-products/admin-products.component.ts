import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/model/product.model';
import {AdminProductDialogComponent} from './admin-product-dialog/admin-product-dialog.component';
import {HuCurrencyPipe} from '../../shared/pipes/hu-currency.pipe';
import {OrderService} from '../../shared/services/order.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    HuCurrencyPipe
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent {
  private _snackBar = inject(MatSnackBar);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  displayedColumns: string[] = ['name', 'price', 'quantity', 'actions'];
  isLoading = true;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this._snackBar.open('Hiba történt a termékek betöltése során!', 'Bezár', {
          duration: 3000,
        });
        this.isLoading = false;
      }
    });
  }

  openProductDialog(product?: Product) {
    const dialogRef = this.dialog.open(AdminProductDialogComponent, {
      width: '500px',
      data: product ? {...product} : undefined
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.productService.updateProduct(result.id, result).then(() => {
            this._snackBar.open('Termék sikeresen frissítve!', 'Bezár', {
              duration: 3000,
            });
            this.loadProducts();
          }).catch(error => {
            console.error('Error updating product:', error);
            this._snackBar.open('Hiba történt a termék frissítése során!', 'Bezár', {
              duration: 3000,
            });
          });
        } else {
          this.productService.addProduct(result).then(() => {
            this._snackBar.open('Termék sikeresen létrehozva!', 'Bezár', {
              duration: 3000,
            });
            this.loadProducts();
          }).catch(error => {
            console.error('Error creating product:', error);
            this._snackBar.open('Hiba történt a termék létrehozása során!', 'Bezár', {
              duration: 3000,
            });
          });
        }
      }
    });
  }

  deleteProduct(product: Product) {
    if (confirm(`Biztosan törölni szeretnéd a következő terméket: ${product.name}? Ha kitörlöd, akkor az összes rendelésből is törlődni fog!`)) {
      this.productService.deleteProduct(product.id).then(() => {
        this._snackBar.open('Termék sikeresen törölve!', 'Bezár', {
          duration: 3000,
        });
        this.loadProducts();

        this.orderService.getAllOrders().subscribe(orders => {
          for (let order of orders) {
            const productIndex = order.items.findIndex(p => p.productId === product.id);
            if (productIndex !== -1) {
              order.items.splice(productIndex, 1);
              this.orderService.updateOrder(order.id, order).catch(error => {
                console.error('Error updating order:', error);
              });
            }
          }
        });
      }).catch(error => {
        console.error('Error deleting product:', error);
        this._snackBar.open('Hiba történt a termék törlése során!', 'Bezár', {
          duration: 3000,
        });
      });
    }
  }
}
