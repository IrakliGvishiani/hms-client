import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { Guest } from '../models/guest.models';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private readonly apiUrl = 'http://localhost:8080/api/guest';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Guest[]>> {
    return this.http.get<ApiResponse<Guest[]>>(this.apiUrl);
  }
}