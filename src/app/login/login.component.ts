import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../shared/services/auth.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatProgressBar} from '@angular/material/progress-bar';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    RouterLink,
    MatProgressBar
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  isLoading: boolean = false;
  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    this.isLoading = true;

    let email = this.loginForm.value.email!;
    let password = this.loginForm.value.password!;

    this.authService.signIn(email, password).then(userCredential => {
      this._snackBar.open('Sikeres bejelentkezés!', 'Bezár', {
        duration: 3000,
      });

      this.authService.updateLoginStatus(true);
      this.isLoading = false;
      this.router.navigateByUrl("/");
    }).catch(error => {
      this.isLoading = false;
      let errorMessage = "";

      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Hibás felhasználónév vagy jelszó!';
          break;
        case 'auth/user-not-found':
          errorMessage = 'A megadott felhasználó nem található!';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Hibás jelszó!';
          break;
        default:
          errorMessage = 'Ismeretlen hiba történt!';
      }

      this._snackBar.open(errorMessage, 'Bezár', {
        duration: 10000,
      });
    });
  }
}
