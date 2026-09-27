import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { ReservationService } from '../services/reservation.service';
import { RoomDetails } from '../models/room.models';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss'
})
export class RoomDetailComponent implements OnInit {
  room = signal<RoomDetails | null>(null);
  loading = signal(false);

  currentImageIndex = signal(0);

  checkInDate = '';
  checkOutDate = '';

  bookingLoading = signal(false);
  bookingError = signal<string | null>(null);
  bookingSuccess = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRoom(id);
  }

  loadRoom(id: number): void {
    this.loading.set(true);
    this.roomService.getDetails(id).subscribe({
      next: (res) => {
        this.room.set(res.result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  nextImage(): void {
    const room = this.room();
    if (!room || room.images.length === 0) return;
    this.currentImageIndex.set((this.currentImageIndex() + 1) % room.images.length);
  }

  prevImage(): void {
    const room = this.room();
    if (!room || room.images.length === 0) return;
    this.currentImageIndex.set(
      (this.currentImageIndex() - 1 + room.images.length) % room.images.length
    );
  }

  goToImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  onBook(): void {
    this.bookingError.set(null);
    this.bookingSuccess.set(false);

    const room = this.room();
    if (!room) return;

    if (!this.checkInDate || !this.checkOutDate) {
      this.bookingError.set('Choose Check-in and Check-out Dates');
      return;
    }

    this.bookingLoading.set(true);

    this.reservationService.create({
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      roomIds: [room.id]
    }).subscribe({
      next: () => {
        this.bookingLoading.set(false);
        this.bookingSuccess.set(true);
        this.checkInDate = '';
        this.checkOutDate = '';
      },
      error: (err) => {
        this.bookingLoading.set(false);
        this.bookingError.set(err.error?.message ?? "Couuldn't Create Reservation");
      }
    });
  }

  goBack(): void {
    const room = this.room();
    if (room) {
      this.router.navigate(['/hotels', room.hotelId]);
    }
  }
}