import { Component } from '@angular/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {DatePipe, registerLocaleData} from '@angular/common';
import {OrderService} from '../shared/services/order.service';
import {Order} from '../shared/model/order.model';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import localeHu from '@angular/common/locales/hu';
import {ProductListComponent} from './product-list/product-list/product-list.component';

registerLocaleData(localeHu);


@Component({
  selector: 'app-profile',
  imports: [
    MatTabGroup,
    MatTab,
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    HuCurrencyPipe,
    DatePipe,
    ProductListComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})



export class ProfileComponent {
  //private orders$: Observable<Order[]> = new Observable<Order[]>();
  orders: Order[] = [];

  displayedColumns: string[] = ['id', 'date', 'items', 'price'];


  userDetailsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required,])
  })

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderService.getOrders().subscribe(ordersArray => {
      this.orders = ordersArray;
    })

    console.log(this.orders[0].items);
  }

  onDetailsSubmit() {

  }

  onPasswordSubmit() {

  }

  onRowClick(row: Order) {
    console.log(row);
  }

  protected readonly HuCurrencyPipe = HuCurrencyPipe;
}
