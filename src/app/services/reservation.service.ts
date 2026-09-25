import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import {
  ReservationForCreatingDto,
  ReservationForGettingDto,
  ReservationForUpdatingDto,
  ReservationSearchDto
} from '../models/reservation.models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  create(model: ReservationForCreatingDto): Observable<ApiResponse<ReservationForGettingDto>> {
    return this.http.post<ApiResponse<ReservationForGettingDto>>(this.apiUrl, model);
  }

  getById(id: number): Observable<ApiResponse<ReservationForGettingDto>> {
  return this.http.get<ApiResponse<ReservationForGettingDto>>(`${this.apiUrl}/${id}`);
}

  update(model: ReservationForUpdatingDto): Observable<ApiResponse<number>> {
    return this.http.put<ApiResponse<number>>(this.apiUrl, model);
  }

  delete(id: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(`${this.apiUrl}/${id}`);
  }

  search(filters: ReservationSearchDto): Observable<ApiResponse<ReservationForGettingDto[]>> {
    let params = new HttpParams();

    if (filters.hotelId != null) params = params.set('hotelId', filters.hotelId);
    if (filters.guestId != null) params = params.set('guestId', filters.guestId);
    if (filters.roomId != null) params = params.set('roomId', filters.roomId);
    if (filters.date) params = params.set('date', filters.date);
    if (filters.active != null) params = params.set('active', filters.active);

    return this.http.get<ApiResponse<ReservationForGettingDto[]>>(`${this.apiUrl}/search`, { params });
  }
}