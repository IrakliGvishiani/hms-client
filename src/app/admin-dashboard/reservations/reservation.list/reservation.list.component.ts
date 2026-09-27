import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { HotelService } from '../../../services/hotel.service';
import { ReservationForGettingDto, ReservationStatus } from '../../../models/reservation.models';
import { Hotel } from '../../../models/hotel.models';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './reservation.list.component.html',
  styleUrl: './reservation.list.component.scss'
})
export class ReservationListComponent implements OnInit {
  reservations = signal<ReservationForGettingDto[]>([]);
  hotels = signal<Hotel[]>([]);
  loading = signal(false);

  selectedHotelId: number | null = null;
  activeOnly = false;

  ReservationStatus = ReservationStatus; 

  constructor(
    private reservationService: ReservationService,
    private hotelService: HotelService,
    private authService: AuthService,
    private router: Router
  ) {}

  isManager(): boolean {
  return this.router.url.startsWith('/manager');
}

newReservation(): void {
  const route = this.isManager()
    ? '/manager/reservations/new'
    : '/admin/reservations/new';

  console.log('Navigating to:', route);

  this.router.navigateByUrl(route).then(success => {
    console.log('Navigation success:', success);
  });
}

  ngOnInit(): void {
    this.hotelService.getList({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => this.hotels.set(res.result.items)
    });

    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);

    this.reservationService.search({
      hotelId: this.selectedHotelId,
  active: this.activeOnly ? true : undefined
    }).subscribe({
      next: (res) => {
        this.reservations.set(res.result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange(): void {
    this.loadReservations();
  }

  onCancel(id: number): void {
    if (!confirm('Are You Sure You Want to Cancel Reservation?')) return;

    this.reservationService.delete(id).subscribe({
      next: () => this.loadReservations()
    });
  }

  statusLabel(status: ReservationStatus): string {
    return ['Reserved', 'Active', 'Completed', 'Cancelled'][status] ?? 'Unknown';
  }
}