import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {map, switchMap, take} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Auth} from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
    )
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  )
};

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const userService = inject(UserService);

  return userService.getUserById(auth.currentUser?.uid ?? '').pipe(
    take(1),
    map(user => {
      if (user && user.role === 'admin') {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};





