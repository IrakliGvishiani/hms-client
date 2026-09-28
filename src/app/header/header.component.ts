import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public authService: AuthService,private router: Router) {}
  isLogoutModalOpen = signal(false);
  // onLogout(): void {
  //   this.authService.logout();
  // }

  dashboardLink(): string {
    const role = this.authService.role();
    if (role === 'Admin') return '/admin';
    if (role === 'Manager') return '/manager';
    return '/';
  }

  onLogout(): void {
  this.isLogoutModalOpen.set(true);
}

closeLogoutModal(): void {
  this.isLogoutModalOpen.set(false);
}

confirmLogout(): void {
  this.isLogoutModalOpen.set(false);
  this.authService.logout();
  this.router.navigate(['/login']);
}
}