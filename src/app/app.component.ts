import { Component } from '@angular/core';
import {MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MenuComponent} from './shared/menu/menu.component';
import {RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatToolbar,
    MatIcon,
    MenuComponent,
    RouterOutlet,
    MatIconButton,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-webshop';

}
