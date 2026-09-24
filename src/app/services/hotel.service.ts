import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { Hotel, HotelDetail, HotelForUpdating, PagedRequest, PagedResponse } from '../models/hotel.models';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly apiUrl = 'http://localhost:8080/api/hotel';

  constructor(private http: HttpClient) {}

  getList(params: PagedRequest): Observable<ApiResponse<PagedResponse<Hotel>>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize);

    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.ascending !== undefined) httpParams = httpParams.set('ascending', params.ascending);
    if (params.filterBy) httpParams = httpParams.set('filterBy', params.filterBy);

    return this.http.get<ApiResponse<PagedResponse<Hotel>>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<ApiResponse<HotelDetail>> {
    return this.http.get<ApiResponse<HotelDetail>>(`${this.apiUrl}/${id}`);
  }

  create(name: string, rating: number, country: string, city: string, address: string, images: File[]): Observable<ApiResponse<number>> {
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Rating', rating.toString());
    formData.append('Country', country);
    formData.append('City', city);
    formData.append('Address', address);
    images.forEach(file => formData.append('Images', file));

    return this.http.post<ApiResponse<number>>(this.apiUrl, formData);
  }

  update(
  id: number,
  name: string,
  rating: number,
  address: string,
  imagesToAdd: File[],
  imageIdsToDelete: number[],
  primaryImageId: number | null
): Observable<ApiResponse<number>> {

  const formData = new FormData();

  formData.append('Id', id.toString());
  formData.append('Name', name);
  formData.append('Rating', rating.toString());
  formData.append('Address', address);

  imagesToAdd.forEach(file => {
    formData.append('ImagesToAdd', file);
  });

  imageIdsToDelete.forEach(imageId => {
    formData.append('ImageIdsToDelete', imageId.toString());
  });

  if (primaryImageId !== null) {
    formData.append('PrimaryImageId', primaryImageId.toString());
  }

  return this.http.put<ApiResponse<number>>(
    this.apiUrl,
    formData
  );
}

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}