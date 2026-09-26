import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  isDeleteModalOpen = signal(false);
  loading = signal(false);
  isLogoutModalOpen = signal(false);
 
  errorMessage = signal(null);

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  openDeleteModal(): void {
    console.log('DELETE BUTTON CLICKED');
    this.errorMessage.set(null);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.errorMessage.set(null);
  }

  confirmDeleteAccount(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.adminService.deleteAccount().subscribe({
      next: () => {
        this.loading.set(false);
        this.closeDeleteModal();
        
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to delete account. Please try again.');
      }
    });
  }

  onLogout(): void {
  this.isLogoutModalOpen.set(true);
}

closeLogoutModal(): void {
  this.isLogoutModalOpen.set(false);
}

confirmLogout(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}