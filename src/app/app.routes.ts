import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProductComponent} from './product/product.component';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {ProductsComponent} from './products/products.component';
import {ProfileComponent} from './profile/profile.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {CartComponent} from './cart/cart.component';
import {authGuard, publicGuard} from './shared/guards/auth/auth.guard';
import {CheckoutComponent} from './checkout/checkout.component';
import {AdminComponent} from './admin/admin.component';
import {AdminProductsComponent} from './admin/admin-products/admin-products.component';

export const routes: Routes = [
  {
    path: 'home',
    title: 'XCP - Főoldal',
    component: HomeComponent
  },
  {
    path: 'product/:id',
    title: 'XCP - Termék',
    component: ProductComponent
  },
  {
    path: 'products/:category',
    title: 'XCP - Termékek',
    component: ProductsComponent
  },
  {
    path: 'products',
    title: 'XCP - Termékek',
    component: ProductsComponent
  },
  {
    path: 'profile',
    title: 'XCP - Profil',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    title: 'XCP - Kosár',
    component: CartComponent,
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    title: 'XCP - Rendelés',
    component: CheckoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    title: 'XCP - Admin felület',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/products',
    title: 'XCP - Admin termékek',
    loadComponent: () => import('./admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/orders',
    title: 'XCP - Admin rendelések',
    loadComponent: () => import('./admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'register',
    title: 'XCP - Regisztráció',
    component: RegisterComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'login',
    title: 'XCP - Bejelentkezés',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }

];
