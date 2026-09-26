import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
selector: 'app-confirm-email',
standalone: true,
imports: [CommonModule, FormsModule, RouterLink],
templateUrl: './confirm-email.component.html',
styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
email = '';
code = '';

errorMessage = signal<string | null>(null);
successMessage = signal<string | null>(null);

loading = signal(false);
resendLoading = signal(false);

resendCooldown = signal(0);

private countdownInterval?: ReturnType<typeof setInterval>;

constructor(
private route: ActivatedRoute,
private router: Router,
private authService: AuthService
) {}

ngOnInit(): void {
this.route.queryParams.subscribe(params => {
this.email = params['email'] ?? '';


  if (!this.email) {
    this.errorMessage.set('Email address is missing.');
  }
});


}

onSubmit(): void {
this.errorMessage.set(null);
this.successMessage.set(null);


if (!this.email) {
  this.errorMessage.set('Email address is missing.');
  return;
}

if (!this.code.trim()) {
  this.errorMessage.set('Please enter the confirmation code.');
  return;
}

if (!/^\d{6}$/.test(this.code.trim())) {
  this.errorMessage.set('Confirmation code must contain 6 digits.');
  return;
}

this.loading.set(true);

this.authService.confirmEmail({
  email: this.email,
  code: this.code.trim()
}).subscribe({
  next: () => {
    this.loading.set(false);

    this.successMessage.set(
      'Your email has been successfully confirmed.'
    );

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  },
  error: (err) => {
    this.loading.set(false);

    this.errorMessage.set(
      err.error?.message ?? 'Unable to confirm your email.'
    );
  }
});


}

resendCode(): void {
this.errorMessage.set(null);
this.successMessage.set(null);


if (!this.email) {
  this.errorMessage.set('Email address is missing.');
  return;
}

if (this.resendCooldown() > 0 || this.resendLoading()) {
  return;
}

this.resendLoading.set(true);

this.authService.resendConfirmationCode(this.email).subscribe({
  next: () => {
    this.resendLoading.set(false);

    this.successMessage.set(
      'A new confirmation code has been sent to your email.'
    );

    this.startResendCooldown();
  },
  error: (err) => {
    this.resendLoading.set(false);

    this.errorMessage.set(
      err.error?.message ?? 'Unable to resend confirmation code.'
    );
  }
});


}

private startResendCooldown(): void {
this.resendCooldown.set(60);


this.countdownInterval = setInterval(() => {
  const remaining = this.resendCooldown();

  if (remaining <= 1) {
    this.resendCooldown.set(0);

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    return;
  }

  this.resendCooldown.set(remaining - 1);
}, 1000);


}

ngOnDestroy(): void {
if (this.countdownInterval) {
clearInterval(this.countdownInterval);
}
}
}
