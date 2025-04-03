import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProductComponent} from './product/product.component';

export const routes: Routes = [
  {
    path: '',
    title: 'XCP - Főoldal',
    component: HomeComponent
  },
  {
    path: 'product',
    title: 'XCP - Termék',
    component: ProductComponent
  }
];
