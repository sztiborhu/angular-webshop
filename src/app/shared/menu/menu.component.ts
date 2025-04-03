import {Component, Input} from '@angular/core';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-menu',
  imports: [
    MatNavList,
    MatIcon,
    RouterLink,
    MatListItem,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() sidenav!: MatSidenav;
  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
}
