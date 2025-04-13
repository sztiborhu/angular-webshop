import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private router : Router) {

  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/']);
    }
  }


  onSubmit() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('email', this.registerForm.value.email!);
    localStorage.setItem('password', this.registerForm.value.password!);

    this.router.navigate(['/']);
    this._snackBar.open('Sikeres regisztráció!', 'Bezár', {
      duration: 3000,
    });
  }
}
