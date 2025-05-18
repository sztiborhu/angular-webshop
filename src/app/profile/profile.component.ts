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
import {Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {
  RowHoverHighlightDirective
} from '../shared/directive/row-hover-highlight.directive';
import {AuthService} from '../shared/services/auth.service';
import {
  Auth, authState,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  user
} from '@angular/fire/auth';
import {MatProgressBar} from '@angular/material/progress-bar';
import {firebaseApp$} from '@angular/fire/app';
import {switchMap, take} from 'rxjs/operators';
import {MatIcon} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProfileOrderDialogComponent } from './profile-order-dialog/profile-order-dialog.component';

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
    RowHoverHighlightDirective,
    MatProgressBar,
    MatIcon,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})



export class ProfileComponent {
  private _snackBar = inject(MatSnackBar);
  private auth = inject(Auth);
  private dialog = inject(MatDialog);

  //private orders$: Observable<Order[]> = new Observable<Order[]>();
  orders: Order[] = [];

  displayedColumns: string[] = ['date', 'items', 'status', 'price'];

  userDetailsForm = new FormGroup({
    name: new FormControl('', []),
    email: new FormControl('', [Validators.email]),
    currentPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', []),
    confirmPassword: new FormControl('', [])
  })


  user: User | undefined = undefined;
  user$ = user(this.auth);

  isLoading: boolean = false;
  isLoadingProfile: boolean = false;
  isLoadingOrders: boolean = false;


  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router : Router,
    private authService: AuthService) {
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


    this.user$.subscribe(currentUser => {
      if (currentUser) {
        this.userService.getUserById(currentUser.uid).subscribe(userData => {
          this.user = {
            id: currentUser.uid,
            name: userData.name,
            email: userData.email,
            role: 'user'
          }
          this.userDetailsForm.patchValue({
            name: this.user.name,
            email: this.user.email
          })
          this.isLoading = false;
        });

        this.orderService.getOrdersOfUser(currentUser.uid).subscribe(ordersArray => {
          this.orders = ordersArray;
        });
      }
    });
  }

  onDetailsSubmit() {
    let name = this.userDetailsForm.get('name')?.value as string;
    let email = this.userDetailsForm.get('email')?.value as string;
    let currentPassword = this.userDetailsForm.get('currentPassword')?.value as string;
    let password = this.userDetailsForm.get('password')?.value as string;
    let confirmPassword = this.userDetailsForm.get('confirmPassword')?.value as string;

    if (password !== confirmPassword) {
      this._snackBar.open("A két jelszó nem egyezik meg!", 'Bezár', {
        duration: 10000,
      });
      return;
    }

    const noNameChange = name === this.user!.name;
    const noEmailChange = email === this.user!.email;
    const noPasswordChange = password === '';

    if (noNameChange && noEmailChange && noPasswordChange) {
      this._snackBar.open('Nincs változtatás a profilban!', 'Bezár', {
        duration: 3000,
      });
      return;
    }

    this.isLoadingProfile = true;

    this.user$.pipe(
      take(1)
    ).subscribe(currentUser => {
      if (currentUser) {
        const updatePromises: Promise<any>[] = [];

        if (!noNameChange) {
          updatePromises.push(
            this.userService.updateUser(currentUser.uid, { name: name })
              .catch(error => {
                console.error('Name update error:', error);
                this._snackBar.open('Hiba történt a név frissítése során!', 'Bezár', {
                  duration: 10000,
                });
                throw error;
              })
          );
        }

        if (!noEmailChange || !noPasswordChange) {
          const credential = EmailAuthProvider.credential(
            currentUser.email!,
            currentPassword
          );

          reauthenticateWithCredential(currentUser, credential)
            .then(() => {
              if (!noPasswordChange) {
                updatePromises.push(
                  updatePassword(currentUser, password)
                    .catch(error => {
                      console.error('Password update error:', error);
                      this._snackBar.open('Hiba történt a jelszó frissítése során!', 'Bezár', {
                        duration: 10000,
                      });
                      throw error;
                    })
                );
              }

              if (!noEmailChange) {
                updatePromises.push(
                  updateEmail(currentUser, email)
                    .then(() => this.userService.updateUser(currentUser.uid, { email: email }))
                    .catch(error => {
                      console.error('Email update error:', error);
                      this._snackBar.open('Hiba történt az email cím frissítése során!', 'Bezár', {
                        duration: 10000,
                      });
                      throw error;
                    })
                );
              }

              return Promise.all(updatePromises)
                .then(() => {
                  this.authService.signOut();
                  this.router.navigateByUrl("/login");
                  this._snackBar.open('Saját adatok sikeresen megváltoztatva! Kérem jelentkezzen be újra!', 'Bezár', {
                    duration: 3000,
                  });
                })
                .catch(() => {
                })
                .finally(() => {
                  this.isLoadingProfile = false;
                });
            })
            .catch(error => {
              console.error('Reauthentication error:', error);
              this._snackBar.open('Hibás jelenlegi jelszó!', 'Bezár', {
                duration: 10000,
              });
              this.isLoadingProfile = false;
            });
        } else {
          Promise.all(updatePromises)
            .then(() => {
              this._snackBar.open('Saját adatok sikeresen megváltoztatva!', 'Bezár', {
                duration: 3000,
              });

            })
            .catch(() => {
            })
            .finally(() => {
              this.isLoadingProfile = false;
            });
        }
      }
    });
  }

  onRowClick(row: Order) {
  }

  onLogout() {
    this.authService.signOut().then(() => {
      this.authService.updateLoginStatus(false);
      this._snackBar.open('Sikeres kijelentkezés!', 'Bezár', {
        duration: 3000,
      });
      this.router.navigate(['/']);
    })

  }


  openOrderDialog(order: Order) {
    this.dialog.open(ProfileOrderDialogComponent, {
      width: '400px',
      data: order
    });
  }
}
