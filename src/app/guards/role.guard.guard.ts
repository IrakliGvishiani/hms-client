import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthorized() || !allowedRoles.includes(authService.role() ?? '')) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  };
}