import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AdminProductsComponent} from './admin-products/admin-products.component';
import {AdminOrdersComponent} from './admin-orders/admin-orders.component';
import {UserService} from '../shared/services/user.service';
import {Auth, User} from '@angular/fire/auth';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../shared/services/auth.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatButton,
    MatIcon
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private auth = inject(Auth);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  fireUser: User | null = null;

  isLoading = false;

  constructor() {
    this.isLoading = true;
    // Simulate a delay for loading
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  ngOnInit() {
    this.fireUser = this.auth.currentUser;


  }

  logOut() {
    this.authService.signOut();
  }
}
