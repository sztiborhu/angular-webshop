import {Component, inject} from '@angular/core';
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
import {User} from '../shared/model/user.model';
import {UserService} from '../shared/services/user.service';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

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
  private _snackBar = inject(MatSnackBar);

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

  user$: Observable<User> | undefined = undefined;
  user: User | undefined = undefined;


  constructor(private orderService: OrderService, private userService: UserService, private router : Router) {

  }

  ngOnInit() {
    this.orderService.getOrders().subscribe(ordersArray => {
      this.orders = ordersArray;
    })

    this.user$ = this.userService.getUser();
    this.user$?.subscribe(user => {
      this.user = user;
    });

    this.userDetailsForm.patchValue({
      name: this.user?.name,
      email: this.user?.email
    })
  }

  onDetailsSubmit() {
    if (this.user) {
      this.user.name = this.userDetailsForm.get('name')?.value as string;
      this.user.email = this.userDetailsForm.get('email')?.value as string;
    }

    this._snackBar.open('Saját adatok sikeresen megváltoztatva!', 'Bezár', {
      duration: 3000,
    });

  }

  onPasswordSubmit() {
    this._snackBar.open('Jelszó sikeresen megváltoztatva!', 'Bezár', {
      duration: 3000,
    });
  }

  onRowClick(row: Order) {
    console.log(row);
  }

  protected readonly HuCurrencyPipe = HuCurrencyPipe;
  protected readonly localStorage = localStorage;

  onLogout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    this._snackBar.open('Sikeres kijelentkezés!', 'Bezár', {
      duration: 3000,
    });
    this.router.navigate(['/login']);
  }
}
