import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../../../services/manager.service'; 
import { HotelAnalyticsDto } from '../../../models/manager.models'; 

@Component({
  selector: 'app-hotel-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel.analytics.component.html',
  styleUrl: './hotel.analytics.component.scss'
})
export class HotelAnalyticsComponent implements OnInit {
  analytics = signal<HotelAnalyticsDto | null>(null);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor(private managerService: ManagerService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.managerService.getHotelAnalytics().subscribe({
      next: (res) => {
        
        this.analytics.set(res.result ?? res.result);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to load hotel analytics.');
      }
    });
  }
}