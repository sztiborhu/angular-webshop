import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressBar} from '@angular/material/progress-bar';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    RouterLink,
    MatTooltip,
    MatProgressBar,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _snackBar = inject(MatSnackBar);

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required,])
  })

  isLoading: boolean = false;

  constructor(private router : Router, private authService: AuthService, private userService: UserService) {

  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/']);
    }
  }


  onSubmit() {
    this.isLoading = true;

    let name = this.registerForm.value.name!;
    let email = this.registerForm.value.email!;
    let password = this.registerForm.value.password!;
    let confirmPassword = this.registerForm.value.confirmPassword!;

    if (password !== confirmPassword) {
      this._snackBar.open("A két jelszó nem egyezik meg!", 'Bezár', {
        duration: 10000,
      });
      this.isLoading = false;
      return;
    }

    this.authService.register(email, password).then(userCredential => {
      this._snackBar.open('Sikeres regisztráció!', 'Bezár', {
        duration: 3000,
      });

      const user = userCredential.user;

      this.userService.createUser({
        "id": user.uid,
        "name": name,
        "email": email,
        "role": "user"
      }).then(() => {
        this.authService.updateLoginStatus(true);
        this.isLoading = false;
        this.router.navigateByUrl("/");
      });
    }).catch(error => {
      this.isLoading = false;
      let errorMessage = "";

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Az e-mail cím már használatban van!';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Érvénytelen e-mail cím!';
          break;
        case 'auth/weak-password':
          errorMessage = 'A jelszó túl gyenge! Legalább 6 karakter hosszúnak kell lennie!';
          break;
        default:
          errorMessage = 'Ismeretlen hiba történt!';
      }

      this._snackBar.open(error.code, 'Bezár', {
        duration: 10000,
      });
    });
  }
}
