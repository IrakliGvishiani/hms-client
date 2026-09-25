import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }

   private readonly apiUrl = 'http://localhost:8080/api/admin';

  deleteAccount(): Observable<ApiResponse<string>> {
  return this.http.delete<ApiResponse<string>>(
    `${this.apiUrl}/account`
  );
}
}
