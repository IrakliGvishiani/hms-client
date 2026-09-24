import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse } from '../models/auth.models';
import { getRoleFromToken } from '../utils/jwt.util';
import { ManagerRegistrationRequestDto } from '../models/manager.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  isAuthorized = signal(false);
  role = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkStatus();
  }

  checkStatus(): void {
    const token = localStorage.getItem('access_token');
    this.isAuthorized.set(!!token);
    this.role.set(token ? getRoleFromToken(token) : null);
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.result.accessToken);
        localStorage.setItem('refresh_token', response.result.refreshToken);
        this.isAuthorized.set(true);
        this.role.set(getRoleFromToken(response.result.accessToken));
      })
    );
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/refresh-token`, JSON.stringify(refreshToken), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/revoke-token`, JSON.stringify(refreshToken), {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({ error: () => {} });
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthorized.set(false);
    this.role.set(null);
    this.router.navigate(['/']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
  registerManager(model: ManagerRegistrationRequestDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}/register-manager`, model);
  }
}