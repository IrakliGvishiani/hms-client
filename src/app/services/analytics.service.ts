import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/auth.models';
import { HotelAnalytics } from '../models/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private readonly apiUrl =
    'http://localhost:8080/api/manager';

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<ApiResponse<HotelAnalytics>> {
    return this.http.get<ApiResponse<HotelAnalytics>>(
      `${this.apiUrl}/analytics`
    );
  }
}