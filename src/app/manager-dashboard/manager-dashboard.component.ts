import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent {
  constructor(public authService: AuthService,private router: Router) {}
  isLogoutModalOpen = signal(false);

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