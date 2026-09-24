import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from './../models/auth.models';
import {
  Room,
  RoomDetails
} from '../models/room.models';

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

  create(
    name: string,
    price: number,
    hotelId: number,
    images: File[]
  ): Observable<ApiResponse<number>> {

    const formData = new FormData();

    formData.append('Name', name);
    formData.append('Price', price.toString());
    formData.append('HotelId', hotelId.toString());

    images.forEach(file => {
      formData.append('Images', file);
    });

    return this.http.post<ApiResponse<number>>(
      this.apiUrl,
      formData
    );
  }

  update(
    id: number,
    name: string,
    price: number,
    imagesToAdd: File[],
    imageIdsToDelete: number[],
    primaryImageId: number | null
  ): Observable<ApiResponse<RoomDetails>> {

    const formData = new FormData();

    formData.append('Id', id.toString());
    formData.append('Name', name);
    formData.append('Price', price.toString());

    imagesToAdd.forEach(file => {
      formData.append('ImagesToAdd', file);
    });

    imageIdsToDelete.forEach(imageId => {
      formData.append(
        'ImageIdsToDelete',
        imageId.toString()
      );
    });

    if (primaryImageId !== null) {
      formData.append(
        'PrimaryImageId',
        primaryImageId.toString()
      );
    }

    return this.http.put<ApiResponse<RoomDetails>>(
      this.apiUrl,
      formData
    );
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${id}`
    );
  }
}