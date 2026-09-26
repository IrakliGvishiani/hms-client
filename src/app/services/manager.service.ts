import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models'; 
import { 
  ManagerListForGettingDto, 
  ManagerForUpdatingDto, 
  HotelAnalyticsDto, 
  ManagerProfile
} from '../models/manager.models';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private readonly apiUrl = 'http://localhost:8080/api/manager';

  constructor(private http: HttpClient) {}


  getAll(): Observable<ApiResponse<ManagerListForGettingDto[]>> {
    return this.http.get<ApiResponse<ManagerListForGettingDto[]>>(this.apiUrl);
  }

  
  update(model: ManagerForUpdatingDto): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(this.apiUrl, model);
  }

  getOwnProfile(): Observable<ApiResponse<ManagerProfile>> {
  return this.http.get<ApiResponse<ManagerProfile>>(`${this.apiUrl}/me`);
}
 
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  
  getHotelAnalytics(): Observable<ApiResponse<HotelAnalyticsDto>> {
    return this.http.get<ApiResponse<HotelAnalyticsDto>>(`${this.apiUrl}/analytics`);
  }
}