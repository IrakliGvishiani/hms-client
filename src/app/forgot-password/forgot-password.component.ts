import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
selector: 'app-forgot-password',
standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
templateUrl: './forgot-password.component.html',
styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
email = '';

errorMessage = signal<string | null>(null);
successMessage = signal<string | null>(null);
loading = signal(false);

constructor(private authService: AuthService) {}

onSubmit(): void {
this.errorMessage.set(null);
this.successMessage.set(null);


if (!this.email.trim()) {
  this.errorMessage.set('Please enter your email.');
  return;
}

this.loading.set(true);

this.authService.forgotPassword(this.email).subscribe({
  next: () => {
    this.loading.set(false);
    this.successMessage.set(
      'If an account with this email exists, a password reset link has been sent.'
    );
  },
  error: (err) => {
    this.loading.set(false);
    this.errorMessage.set(
      err.error?.message ?? 'Unable to send password reset email.'
    );
  }
});


}
}
