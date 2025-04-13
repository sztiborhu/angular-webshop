import {Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MenuComponent} from './shared/menu/menu.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatFormField, MatLabel} from '@angular/material/input';


@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatToolbar,
    MatIcon,
    MenuComponent,
    RouterOutlet,
    MatIconButton,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-webshop';

  constructor(protected router: Router) {
  }

  search() {

  }
}
