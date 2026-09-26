import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
selector: 'app-register',
standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
templateUrl: './register.component.html',
styleUrl: './register.component.scss'
})
export class RegisterComponent {
firstName = '';
lastName = '';
email = '';
password = '';
personalNumber = '';
phoneNumber = '';

errorMessage = signal<string | null>(null);
loading = signal(false);

constructor(
private authService: AuthService,
private router: Router
) {}

onSubmit(): void {
this.errorMessage.set(null);


if (
  !this.firstName.trim() ||
  !this.lastName.trim() ||
  !this.email.trim() ||
  !this.password ||
  !this.personalNumber.trim() ||
  !this.phoneNumber.trim()
) {
  this.errorMessage.set('Please fill in all fields.');
  return;
}

this.loading.set(true);

this.authService.registerGuest({
  firstName: this.firstName.trim(),
  lastName: this.lastName.trim(),
  email: this.email.trim(),
  password: this.password,
  personalNumber: this.personalNumber.trim(),
  phoneNumber: this.phoneNumber.trim()
}).subscribe({
  next: () => {
    this.loading.set(false);

    this.router.navigate(['/confirm-email'], {
      queryParams: {
        email: this.email.trim()
      }
    });
  },
  error: (err) => {
    this.loading.set(false);

    this.errorMessage.set(
      err.error?.message ?? 'Unable to create your account.'
    );
  }
});


}
}
