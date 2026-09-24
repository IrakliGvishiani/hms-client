import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { Room, RoomDetails } from '../models/room.models';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiUrl = 'http://localhost:8080/api/room';

  constructor(private http: HttpClient) {}

  getByHotelId(hotelId: number): Observable<ApiResponse<Room[]>> {
    return this.http.get<ApiResponse<Room[]>>(
      `${this.apiUrl}/${hotelId}`
    );
  }

  getDetails(id: number): Observable<ApiResponse<RoomDetails>> {
    return this.http.get<ApiResponse<RoomDetails>>(
      `${this.apiUrl}/details/${id}`
    );
  }
}