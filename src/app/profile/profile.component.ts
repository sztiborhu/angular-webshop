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
import {Observable} from 'rxjs';
import {OrderService} from '../shared/services/order.service';
import {Order} from '../shared/model/order.model';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import localeHu from '@angular/common/locales/hu';

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
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})



export class ProfileComponent {
  //private orders$: Observable<Order[]> = new Observable<Order[]>();
  orders: Order[] = [];

  displayedColumns: string[] = ['id', 'date', 'items', 'price'];
  dataSource = this.orders;


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

    console.log(this.orders)
  }

  onDetailsSubmit() {

  }

  onPasswordSubmit() {

  }

  protected readonly HuCurrencyPipe = HuCurrencyPipe;
}
