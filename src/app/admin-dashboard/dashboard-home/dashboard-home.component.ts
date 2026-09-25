import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsService } from '../../services/analytics.service';
import { HotelAnalytics } from '../../models/analytics';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {

  analytics = signal<HotelAnalytics | null>(null);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.analyticsService.getAnalytics().subscribe({
      next: (res) => {
        this.analytics.set(res.result);
        this.loading.set(false);
      },

      error: (err) => {
        this.loading.set(false);

        this.errorMessage.set(
          err.error?.message ??
          'Error while loading analytics.'
        );
      }
    });
  }
}