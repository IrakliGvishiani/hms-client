import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorDialogService } from '../services/error-dialog.service';

function getTokenExpiration(token: string): number | null {
  if (!token || !token.includes('.')) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  return Date.now() > exp;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorDialog = inject(ErrorDialogService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  const isRefreshRequest = req.url.includes('/auth/refresh-token');
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (accessToken && !isRefreshRequest && !isAuthRequest && isTokenExpired(accessToken)) {
    return authService.refreshToken().pipe(
      switchMap(response => {
        localStorage.setItem('access_token', response.result.accessToken);
        localStorage.setItem('refresh_token', response.result.refreshToken);

        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${response.result.accessToken}` }
        });
        return next(clonedReq);
      }),
      catchError(refreshErr => {
        authService.logout();
        return throwError(() => refreshErr);
      })
    );
  }

  let modifiedReq = req;
  if (accessToken && !isRefreshRequest && !isAuthRequest) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(modifiedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const messages: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Access Denied',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error'
      };

      const message = err.error?.message ?? messages[err.status] ?? 'Error';
      errorDialog.setErrMessage(message);
      errorDialog.showDialog();

      if (err.status === 401) {
        authService.logout();
      }

      return throwError(() => err);
    })
  );
};