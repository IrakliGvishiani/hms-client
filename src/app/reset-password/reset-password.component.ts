import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
selector: 'app-reset-password',
standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
templateUrl: './reset-password.component.html',
styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
email = '';
token = '';

newPassword = '';
confirmPassword = '';

errorMessage = signal<string | null>(null);
successMessage = signal<string | null>(null);
loading = signal(false);

constructor(
private route: ActivatedRoute,
private authService: AuthService,
private router: Router
) {}

ngOnInit(): void {
this.route.queryParams.subscribe(params => {
this.email = params['email'] ?? '';
this.token = params['token'] ?? '';


  if (!this.email || !this.token) {
    this.errorMessage.set('Invalid or incomplete password reset link.');
  }
});


}

onSubmit(): void {
this.errorMessage.set(null);
this.successMessage.set(null);


if (!this.email || !this.token) {
  this.errorMessage.set('Invalid password reset link.');
  return;
}

if (!this.newPassword || !this.confirmPassword) {
  this.errorMessage.set('Please fill in all fields.');
  return;
}

if (this.newPassword !== this.confirmPassword) {
  this.errorMessage.set('Passwords do not match.');
  return;
}

this.loading.set(true);

this.authService.resetPassword({
  email: this.email,
  token: this.token,
  newPassword: this.newPassword
}).subscribe({
  next: () => {
    this.loading.set(false);
    this.successMessage.set(
      'Your password has been successfully changed.'
    );

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  },
  error: (err) => {
    this.loading.set(false);

    this.errorMessage.set(
      err.error?.message ?? 'Unable to reset password.'
    );
  }
});


}
}
