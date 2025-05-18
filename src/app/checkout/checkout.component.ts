import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatTooltip} from '@angular/material/tooltip';
import {ProductService} from '../shared/services/product.service';
import {CartService} from '../shared/services/cart.service';
import {Auth, authState, User} from '@angular/fire/auth';
import {Observable, forkJoin, of} from 'rxjs';
import {CartItem} from '../shared/model/cartitem.model';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HuCurrencyPipe} from '../shared/pipes/hu-currency.pipe';
import {NgForOf} from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';
import {OrderService} from '../shared/services/order.service';
import {Order} from '../shared/model/order.model';
import {UserService} from '../shared/services/user.service';
import {switchMap} from 'rxjs/operators';

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
  paymentMethod: string;
}

export interface CreditCardDetails {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface CheckOutItem {
  id: string
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  imports: [
    FormsModule,
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatSelect,
    MatOption,
    MatTooltip,
    HuCurrencyPipe,
    NgForOf,
    MatProgressBar,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private _snackBar = inject(MatSnackBar);
  private auth = inject(Auth);

  shippingForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[- +()0-9]+$')]),
    paymentMethod: new FormControl('', [Validators.required])
  })

  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
    expiryDate: new FormControl('', [Validators.required]),
    cvc: new FormControl('', [Validators.required, Validators.pattern('^[- +()0-9]+$')])
  })

  deliveryDetails: DeliveryDetails = {
    name: '',
    address: '',
    phone: '',
    paymentMethod: ''
  };

  creditCardDetails: CreditCardDetails = {
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  };

  isFirstStage: boolean = true;
  isSecondStage: boolean = false;
  isThirdStage: boolean = false;
  isLoading: boolean = false;

  currentTabIndex: number = 0;

  cartItems$: Observable<CartItem[]> = new Observable<CartItem[]>();
  totalPrice$: Observable<number> = new Observable<number>();

  user: User | null = null;

  checkOutItems: CheckOutItem[] = [];
  displayedColumns: string[] = ['name', 'price', 'quantity'];

  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router) {
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return this.userService.isAdmin(user.uid);
        }
        return of(false);
      })
    ).subscribe(isAdmin => {
      if (isAdmin) {
        this.router.navigateByUrl("/admin");
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.user = this.auth.currentUser;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartItems$ = this.cartService.getCartItems(this.user.uid);
    this.cartService.getCartTotal(this.user.uid).subscribe(totalPrice => {
        this.totalPrice = totalPrice;
    });

    this.cartItems$.subscribe(cartItems => {
      if (cartItems.length === 0) {
        this.router.navigate(['/']);
        return;
      }

      for (const cartItem of cartItems) {
        this.productService.getProductById(cartItem.productId).subscribe(product => {
          this.checkOutItems.push({
            id: cartItem.productId,
            name: product.name,
            price: product.price,
            quantity: cartItem.quantity
          });
        });
      }

      this.isLoading = false;
    });
  }

  onShippingSubmit() {
    if (this.shippingForm.valid) {
      this.deliveryDetails.name = this.shippingForm.value.name!;
      this.deliveryDetails.address = this.shippingForm.value.address!;
      this.deliveryDetails.phone = this.shippingForm.value.phone!;
      this.deliveryDetails.paymentMethod = this.shippingForm.value.paymentMethod!;

      this.isFirstStage = false;
      this.isSecondStage = true;
      this.currentTabIndex = 1;
    }
  }

  onPaymentSubmit() {
    if (this.deliveryDetails.paymentMethod === "creditCard") {
      const cardNumber = this.paymentForm.value.cardNumber!;
      const expiryDate = this.paymentForm.value.expiryDate!;
      const cvc = this.paymentForm.value.cvc!;

      this.creditCardDetails.cardNumber = cardNumber;
      this.creditCardDetails.expiryDate = expiryDate;
      this.creditCardDetails.cvc = cvc;

      this.isSecondStage = false;
      this.isThirdStage = true;
      this.currentTabIndex = 2;
    } else if (this.deliveryDetails.paymentMethod === "cashOnDelivery") {
      this.isSecondStage = false;
      this.isThirdStage = true;
      this.currentTabIndex = 2;
    }
  }

  onBack() {
    if (this.currentTabIndex === 1) {
      this.currentTabIndex = 0;
      this.isFirstStage = true;
      this.isSecondStage = false;

      this.paymentForm.reset();
    } else if (this.currentTabIndex === 2) {
      this.currentTabIndex = 1;
      this.isSecondStage = true;
      this.isThirdStage = false;
    }
  }

  onConfirmOrder() {
    this.orderService.createOrder({
      user_id: this.user!.uid,
      total_price: this.totalPrice,
      address: this.deliveryDetails.address,
      date: Date.now(),
      status: 'pending',
      items: this.checkOutItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    }).then(() => {
      this.router.navigate(['/']);

      this._snackBar.open('Rendelés sikeresen leadva!', 'Bezár', {
        duration: 3000,
      });
      this.cartService.clearCart(this.user!.uid);
    });
  }
}
