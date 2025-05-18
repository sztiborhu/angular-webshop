import {Component, inject} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MenuComponent} from './shared/menu/menu.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {UserService} from './shared/services/user.service';
import {Auth, User} from '@angular/fire/auth';
import {authState} from '@angular/fire/auth';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MatProgressBar} from '@angular/material/progress-bar';

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

  search() {
  }

  protected readonly localStorage = localStorage;
}
