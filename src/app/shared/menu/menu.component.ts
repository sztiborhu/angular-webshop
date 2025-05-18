import {Component, inject, Input} from '@angular/core';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';
import {Auth, authState} from '@angular/fire/auth';
import {UserService} from '../services/user.service';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

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

  private auth = inject(Auth);
  private userService = inject(UserService);

  title = 'angular-webshop';
  isAdmin = false;

  constructor(protected router: Router) {}

  ngOnInit() {
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          return this.userService.isAdmin(user.uid);
        }
        return of(false);
      })
    ).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
}
