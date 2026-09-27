import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { ReservationForGettingDto, ReservationStatus } from '../models/reservation.models';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit {
  reservations = signal<ReservationForGettingDto[]>([]);
  loading = signal(false);
  ReservationStatus = ReservationStatus;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    this.reservationService.search({}).subscribe({
      next: (res) => {
        this.reservations.set(res.result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onCancel(id: number): void {
    if (!confirm('Are you sure you want to cancel reservation?')) return;

    this.reservationService.delete(id).subscribe({
      next: () => this.loadReservations()
    });
  }

  statusLabel(status: ReservationStatus): string {
    return ['Reserved', 'Active', 'Completed', 'Cancelled'][status] ?? 'Unknown';
  }
}