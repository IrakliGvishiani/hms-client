import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin.form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.form.component.html',
  styleUrl: './admin.form.component.scss'
})
export class AdminFormComponent {
  firstName = '';
  lastName = '';
  personalNumber = '';
  email = '';
  password = '';
  phoneNumber = '';

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.loading.set(true);

    this.authService.registerAdmin({
      firstName: this.firstName,
      lastName: this.lastName,
      personalNumber: this.personalNumber,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('New Admin Registered Successfully');
        this.resetForm();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Error While Registering Admin');
      }
    });
  }

  private resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.personalNumber = '';
    this.email = '';
    this.password = '';
    this.phoneNumber = '';
  }
}