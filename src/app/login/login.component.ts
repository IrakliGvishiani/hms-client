import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userName = '';
  password = '';
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login({ userName: this.userName, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        const role = this.authService.role();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'შესვლა ვერ მოხერხდა');
      }
    });
  }
}