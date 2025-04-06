import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProductComponent} from './product/product.component';
import {PageNotFoundComponent} from './shared/page-not-found/page-not-found.component';
import {ProductsComponent} from './products/products.component';
import {ProfileComponent} from './profile/profile.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';

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
    path: 'products',
    title: 'XCP - Termékek',
    component: ProductsComponent
  },
  {
    path: 'profile',
    title: 'XCP - Profil',
    component: ProfileComponent
  },
  {
    path: 'register',
    title: 'XCP - Regisztráció',
    component: RegisterComponent
  },
  {
    path: 'login',
    title: 'XCP - Bejelentkezés',
    component: LoginComponent
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }

];
